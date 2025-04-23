import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Skip if production
  if (process.env.NODE_ENV === 'production') return;

  // Step 1: Create categories
  const categories = ['LEGS', 'PUSH', 'PULL', 'CORE', 'FOREARMS', 'OTHER'];
  const categoryMap: Record<string, number> = {};

  for (const name of categories) {
    const category = await prisma.exerciseCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryMap[name] = category.id;
  }

  // Step 2: Create exercises
  const existingExercises = await prisma.exercise.findFirst();
  if (!existingExercises) {
    const exercises = [
      {
        name: 'Squat',
        notes: 'Push',
        category: 'LEGS',
      },
      {
        name: 'Bench Press',
        notes: 'Push',
        category: 'PUSH',
      },
      {
        name: 'Deadlift',
        notes: 'Pull',
        category: 'PULL',
      },
    ];

    for (const exercise of exercises) {
      try {
        await prisma.exercise.create({
          data: {
            name: exercise.name,
            notes: exercise.notes,
            category_id: categoryMap[exercise.category],
          },
        });
      } catch (e) {
        console.error('Error creating exercise:', e);
      }
    }
  }

  // Step 3: Create session if none
  const existingSession = await prisma.session.findFirst();
  if (!existingSession) {
    try {
      await prisma.session.createMany({
        data: [
          { date: new Date(), notes: 'Morning strength training' },
          { date: new Date(), notes: 'Morning 2' },
        ],
      });
    } catch (e) {
      console.error('Error creating sessions:', e);
    }
  }

  // Step 4: Create session exercises
  const sessionExerciseExists = await prisma.sessionExercise.findFirst();
  if (!sessionExerciseExists) {
    const trainingSession = await prisma.session.findFirst({
      where: { notes: 'Morning strength training' },
    });
    const exercises = await prisma.exercise.findMany();

    if (trainingSession && exercises.length >= 3) {
      const sessionExercises = [
        {
          session_id: trainingSession.id,
          exercise_id: exercises[0].id,
          sets: 3,
          reps: 10,
          weight: 100,
          rest_seconds: 60,
          count: 1,
          completed: true,
          created_at: new Date(),
          success: true,
          notes: 'Good form',
        },
        {
          session_id: trainingSession.id,
          exercise_id: exercises[1].id,
          sets: 3,
          reps: 8,
          weight: 80,
          rest_seconds: 90,
          count: 1,
          completed: false,
          created_at: new Date(),
          success: true,
          notes: 'Struggled with last set',
        },
        {
          session_id: trainingSession.id,
          exercise_id: exercises[2].id,
          sets: 3,
          reps: 5,
          weight: 120,
          rest_seconds: 120,
          count: 1,
          completed: false,
          created_at: new Date(),
          success: false,
          notes: 'Back pain',
        },
      ];

      for (const se of sessionExercises) {
        try {
          await prisma.sessionExercise.create({ data: se });
        } catch (e) {
          console.error('Error creating session exercise:', e);
        }
      }
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
