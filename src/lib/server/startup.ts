import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function createExerciseCategory() {
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
    return categoryMap;
}

async function createExercises(categoryMap: Record<string, number>) {
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
            const category_id = categoryMap[exercise.category];
            if (!category_id) {
                console.warn(`Category '${exercise.category}' not found for exercise '${exercise.name}'. Skipping.`);
                continue;
            }
            try {
                await prisma.exercise.create({
                    data: {
                        name: exercise.name,
                        notes: exercise.notes,
                        category_id: category_id,
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
}

export async function runStartupTasks() {
    const categoryMap = await createExerciseCategory();
    await createExercises(categoryMap);
}
