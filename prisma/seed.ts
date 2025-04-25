import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // Import bcrypt

dotenv.config();

const prisma = new PrismaClient();

const DEFAULT_SEED_USERNAME = 'a'; // Define a default username for seeding
const DEFAULT_SEED_PASSWORD = 'a'; // Define a default password (change if needed)

async function main() {
  // Skip if production
  if (process.env.NODE_ENV === 'production') {
    console.log('Skipping seed script in production environment.');
    return;
  }

  console.log('Starting seed script...');

  // --- Step 1: Create or update exercise categories ---
  console.log('Seeding Exercise Categories...');
  const categories = ['LEGS', 'PUSH', 'PULL', 'CORE', 'FOREARMS', 'OTHER'];
  const categoryMap: Record<string, number> = {};

  for (const name of categories) {
    try {
      const category = await prisma.exerciseCategory.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      categoryMap[name] = category.id;
      console.log(`Upserted category: ${name} (ID: ${category.id})`);
    } catch (e) {
      console.error(`Error upserting category ${name}:`, e);
    }
  }

  // --- Step 2: Create default exercises if none exist ---
  console.log('Checking for existing Exercises...');
  const existingExercise = await prisma.exercise.findFirst();
  if (!existingExercise) {
    console.log('No existing exercises found. Seeding default exercises...');
    const exercisesData = [
      { name: 'Squat', notes: 'Focus on depth', category: 'LEGS' },
      { name: 'Bench Press', notes: 'Keep elbows tucked', category: 'PUSH' },
      { name: 'Deadlift', notes: 'Maintain neutral spine', category: 'PULL' },
      { name: 'Overhead Press', notes: '', category: 'PUSH' },
      { name: 'Barbell Row', notes: '', category: 'PULL' },
      { name: 'Plank', notes: '', category: 'CORE' },
    ];

    for (const exercise of exercisesData) {
      const categoryId = categoryMap[exercise.category];
      if (!categoryId) {
        console.warn(`Category '${exercise.category}' not found for exercise '${exercise.name}'. Skipping.`);
        continue;
      }
      try {
        await prisma.exercise.create({
          data: {
            name: exercise.name,
            notes: exercise.notes,
            category_id: categoryId,
          },
        });
        console.log(`Created exercise: ${exercise.name}`);
      } catch (e) {
        // Handle potential unique constraint violation if run multiple times concurrently (less likely in seed)
        console.error(`Error creating exercise '${exercise.name}':`, e);
      }
    }
  } else {
    console.log('Exercises already exist. Skipping exercise seeding.');
  }

  // --- Step 3: Create a default user if none exist ---
  console.log('Checking for default user...');
  let defaultUser = await prisma.user.findUnique({
    where: { username: DEFAULT_SEED_USERNAME },
  });
  let defaultUserId: string;

  if (!defaultUser) {
    console.log(`Default user '${DEFAULT_SEED_USERNAME}' not found. Creating...`);
    try {
      // Hash the default password
      const passwordHash = await bcrypt.hash(DEFAULT_SEED_PASSWORD, 10); // Use bcrypt

      defaultUser = await prisma.user.create({
        data: {
          username: DEFAULT_SEED_USERNAME,
          password_hash: passwordHash,
        },
      });
      console.log(`Created default user: ${defaultUser.username} (ID: ${defaultUser.id})`);
      defaultUserId = defaultUser.id;
    } catch (e) {
      if ((e as any)?.code === 'P2002' && (e as any)?.meta?.target?.includes('username')) {
        console.warn(`Default user '${DEFAULT_SEED_USERNAME}' already exists (race condition?). Fetching again.`);
        defaultUser = await prisma.user.findUnique({ where: { username: DEFAULT_SEED_USERNAME } });
        if (!defaultUser) {
          console.error('Failed to create or find default user after race condition check.');
          throw new Error('Could not establish default user for seeding.');
        }
        defaultUserId = defaultUser.id;
      } else {
        console.error('Error creating default user:', e);
        throw e; // Stop seeding if user creation fails fundamentally
      }
    }
  } else {
    console.log(`Default user '${DEFAULT_SEED_USERNAME}' already exists.`);
    defaultUserId = defaultUser.id;
  }

  // --- Step 4: Create default sessions if none exist FOR THE DEFAULT USER ---
  console.log(`Checking for existing Sessions for user ${defaultUserId}...`);
  const existingSession = await prisma.session.findFirst({
    where: { user_id: defaultUserId } // Check specifically for sessions belonging to this user
  });

  let firstSessionId: number | undefined = existingSession?.id;

  if (!existingSession) {
    console.log(`No existing sessions found for user ${defaultUserId}. Seeding default sessions...`);
    try {
      const createdSessions = await prisma.session.createManyAndReturn({ // Use createManyAndReturn if available and needed, otherwise createMany
        data: [
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: 'Past strength training', user_id: defaultUserId }, // Link to user
          { date: new Date(), notes: 'Today strength training', user_id: defaultUserId }, // Link to user
        ],
      });
      console.log(`Created ${createdSessions.length} sessions for user ${defaultUserId}.`);
      // Find the ID of one of the created sessions to link exercises
      const todaySession = await prisma.session.findFirst({
        where: { user_id: defaultUserId, notes: 'Today strength training' },
        orderBy: { date: 'desc' }
      });
      firstSessionId = todaySession?.id;

    } catch (e) {
      console.error('Error creating sessions:', e);
      // Don't proceed if sessions weren't created
      firstSessionId = undefined;
    }
  } else {
    console.log(`Sessions already exist for user ${defaultUserId}. Skipping session seeding.`);
    // Optionally, ensure firstSessionId is set if needed later, e.g., find the latest one
    if (!firstSessionId) {
      const latestSession = await prisma.session.findFirst({
        where: { user_id: defaultUserId },
        orderBy: { date: 'desc' }
      });
      firstSessionId = latestSession?.id;
    }
  }

  // --- Step 5: Create default sets if none exist ---
  console.log('Checking for existing Sets...');
  // Check if *any* Set record exists to avoid re-seeding
  const setExists = await prisma.set.findFirst();

  if (!setExists && firstSessionId) {
    console.log(`No existing sets found. Seeding sets for session ID: ${firstSessionId}...`);
    const exercises = await prisma.exercise.findMany({ take: 3 });

    if (exercises.length >= 3) {
      const setsToSeed = [
        // Squats (Exercise 0) - 3 sets of 10 reps @ 100 intensity
        {
          session_id: firstSessionId,
          exercise_id: exercises[0].id,
          reps: 10,
          intensity: 100.0,
        },
        {
          session_id: firstSessionId,
          exercise_id: exercises[0].id,
          reps: 10,
          intensity: 100.0,
        },
        {
          session_id: firstSessionId,
          exercise_id: exercises[0].id,
          reps: 10,
          intensity: 100.0,
        },

        // Bench Press (Exercise 1) - 3 sets of 8 reps @ 80 intensity
        {
          session_id: firstSessionId,
          exercise_id: exercises[1].id,
          reps: 8,
          intensity: 80.0,
        },
        {
          session_id: firstSessionId,
          exercise_id: exercises[1].id,
          reps: 8,
          intensity: 80.0,
        },
        {
          session_id: firstSessionId,
          exercise_id: exercises[1].id,
          reps: 8,
          intensity: 80.0,
        },

        // Deadlift (Exercise 2) - 1 set of 5 reps @ 120 intensity
        {
          session_id: firstSessionId,
          exercise_id: exercises[2].id,
          reps: 5,
          intensity: 120.0,
        },
      ];

      console.log(`Attempting to create ${setsToSeed.length} Set records...`);
      for (const set of setsToSeed) {
        try {
          // Prisma will automatically set created_at if not provided,
          // or you can explicitly set it: created_at: new Date()
          await prisma.set.create({ data: set });
          console.log(`Created set for exercise ID ${set.exercise_id} in session ID ${set.session_id}`);
        } catch (e) {
          console.error(`Error creating set for exercise ID ${set.exercise_id}:`, e);
        }
      }
      console.log('Set seeding complete.');

    } else if (exercises.length < 3) {
      console.warn(`Not enough exercises found in DB (found ${exercises.length}) to seed the planned sets (need at least 3). Skipping set seeding.`);
    }
  } else if (!firstSessionId) {
    console.warn('Skipping set seeding because no target session ID was found or created.');
  } else {
    console.log('Sets already exist. Skipping set seeding.');
  }

  console.log('Seed script finished.');
}

main()
  .catch(e => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  });