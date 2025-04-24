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
        if ((e as any)?.code === 'P2002' && (e as any)?.meta?.target?.includes('name')) {
          console.warn(`Exercise '${exercise.name}' already exists.`);
        } else {
          console.error(`Error creating exercise '${exercise.name}':`, e);
        }
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

  // --- Step 5: Create default session exercises if none exist ---
  console.log('Checking for existing Session Exercises...');
  const sessionExerciseExists = await prisma.sessionExercise.findFirst(); // Maybe refine check based on session ID?

  if (!sessionExerciseExists && firstSessionId) {
    console.log(`No existing session exercises found. Seeding for session ID: ${firstSessionId}...`);
    const exercises = await prisma.exercise.findMany({ take: 3 }); // Get first 3 exercises for seeding

    if (exercises.length >= 3) {
      const sessionExercisesData = [
        {
          session_id: firstSessionId,
          exercise_id: exercises[0].id, // Squat
          sets: 3, reps: 10, weight: 100, rest_seconds: 60, count: 1, completed: true, success: true, notes: 'Good form',
        },
        {
          session_id: firstSessionId,
          exercise_id: exercises[1].id, // Bench Press
          sets: 3, reps: 8, weight: 80, rest_seconds: 90, count: 1, completed: false, success: true, notes: 'Struggled with last set',
        },
        {
          session_id: firstSessionId,
          exercise_id: exercises[2].id, // Deadlift
          sets: 1, reps: 5, weight: 120, rest_seconds: 120, count: 1, completed: false, success: false, notes: 'Felt heavy',
        },
      ];

      for (const se of sessionExercisesData) {
        try {
          // Add created_at here if you want it to be exactly now, otherwise Prisma default works
          await prisma.sessionExercise.create({ data: { ...se, created_at: new Date() } });
          console.log(`Created session exercise for exercise ID ${se.exercise_id} in session ID ${se.session_id}`);
        } catch (e) {
          console.error(`Error creating session exercise for exercise ID ${se.exercise_id}:`, e);
        }
      }
    } else {
      console.warn('Not enough exercises found in DB to seed session exercises.');
    }
  } else if (!firstSessionId) {
    console.warn('Skipping session exercise seeding because no target session ID was found or created.');
  } else {
    console.log('Session exercises already exist. Skipping session exercise seeding.');
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