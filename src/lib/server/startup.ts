import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

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

async function createDefaultUser() {
    // --- Step 3: Create a default user if none exist ---
    let username = process.env.FIRST_USER_USERNAME;
    if (!username) {
        console.error('Environment variable FIRST_USER_USERNAME is not set. Exiting...');
        process.exit(1);
    }
    let password = process.env.FIRST_USER_PASSWORD;
    if (!password) {
        console.error('Environment variable FIRST_USER_PASSWORD is not set. Exiting...');
        process.exit(1);
    }
    console.log('Checking for default user...');
    let defaultUser = await prisma.user.findUnique({
        where: { username: username },
    });
    let defaultUser_id: string;

    if (!defaultUser) {
        console.log(`Default user '${username}' not found. Creating...`);
        try {
            // Hash the default password
            const passwordHash = await bcrypt.hash(password, 10); // Use bcrypt

            defaultUser = await prisma.user.create({
                data: {
                    username: username,
                    password_hash: passwordHash,
                },
            });
            console.log(`Created default user: ${defaultUser.username} (ID: ${defaultUser.id})`);
            defaultUser_id = defaultUser.id;
        } catch (e) {
            if ((e as any)?.code === 'P2002' && (e as any)?.meta?.target?.includes('username')) {
                console.warn(`Default user '${username}' already exists (race condition?). Fetching again.`);
                defaultUser = await prisma.user.findUnique({ where: { username: username } });
                if (!defaultUser) {
                    console.error('Failed to create or find default user after race condition check.');
                    throw new Error('Could not establish default user for seeding.');
                }
                defaultUser_id = defaultUser.id;
            } else {
                console.error('Error creating default user:', e);
                throw e; // Stop seeding if user creation fails fundamentally
            }
        }
    } else {
        console.log(`Default user '${username}' already exists.`);
        defaultUser_id = defaultUser.id;
    }
    return defaultUser_id;
}

async function createFirstSession(defaultUser_id: string) {
    // --- Step 4: Create default sessions if none exist FOR THE DEFAULT USER ---
    console.log(`Checking for existing Sessions for user ${defaultUser_id}...`);
    const existingSession = await prisma.session.findFirst({
        where: { user_id: defaultUser_id } // Check specifically for sessions belonging to this user
    });

    let firstSession_id: number | undefined = existingSession?.id;

    if (!existingSession) {
        console.log(`No existing sessions found for user ${defaultUser_id}. Seeding default sessions...`);
        try {
            const createdSessions = await prisma.session.createManyAndReturn({ // Use createManyAndReturn if available and needed, otherwise createMany
                data: [
                    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: 'Past strength training', user_id: defaultUser_id }, // Link to user
                    { date: new Date(), notes: 'Today strength training', user_id: defaultUser_id }, // Link to user
                ],
            });
            console.log(`Created ${createdSessions.length} sessions for user ${defaultUser_id}.`);
            // Find the ID of one of the created sessions to link exercises
            const todaySession = await prisma.session.findFirst({
                where: { user_id: defaultUser_id, notes: 'Today strength training' },
                orderBy: { date: 'desc' }
            });
            firstSession_id = todaySession?.id;

        } catch (e) {
            console.error('Error creating sessions:', e);
            // Don't proceed if sessions weren't created
            firstSession_id = undefined;
        }
    } else {
        console.log(`Sessions already exist for user ${defaultUser_id}. Skipping session seeding.`);
        // Optionally, ensure firstSession_id is set if needed later, e.g., find the latest one
        if (!firstSession_id) {
            const latestSession = await prisma.session.findFirst({
                where: { user_id: defaultUser_id },
                orderBy: { date: 'desc' }
            });
            firstSession_id = latestSession?.id;
        }
    }
    return firstSession_id;
}

async function createSets(sessionExerciseLinks: { id: number, exercise_id: number }[]) {
    console.log('Checking for existing Sets...');
    const setExists = await prisma.set.findFirst();

    if (!setExists && sessionExerciseLinks.length > 0) {
        console.log(`No existing sets found. Seeding sets for ${sessionExerciseLinks.length} SessionExercise links...`);

        const setsToSeed: { session_exercise_id: number; reps: number; intensity: number }[] = [];

        for (const link of sessionExerciseLinks) {
            if (link.exercise_id === 1) { // Squat example
                setsToSeed.push(
                    { session_exercise_id: link.id, reps: 10, intensity: 100 },
                    { session_exercise_id: link.id, reps: 10, intensity: 100 },
                    { session_exercise_id: link.id, reps: 10, intensity: 100 },
                );
            } else if (link.exercise_id === 2) { // Bench Press example
                setsToSeed.push(
                    { session_exercise_id: link.id, reps: 8, intensity: 80 },
                    { session_exercise_id: link.id, reps: 8, intensity: 80 },
                    { session_exercise_id: link.id, reps: 8, intensity: 80 },
                );
            } else if (link.exercise_id === 3) { // Deadlift example
                setsToSeed.push(
                    { session_exercise_id: link.id, reps: 5, intensity: 120 },
                );
            }
        }

        for (const set of setsToSeed) {
            try {
                await prisma.set.create({ data: set });
                console.log(`Created set for SessionExercise ID ${set.session_exercise_id}`);
            } catch (e) {
                console.error(`Error creating set for SessionExercise ID ${set.session_exercise_id}:`, e);
            }
        }
        console.log('Set seeding complete.');
    } else if (setExists) {
        console.log('Sets already exist. Skipping set seeding.');
    } else {
        console.warn('No SessionExercise links provided. Skipping set seeding.');
    }
}

async function createSessionExercises(session_id: number, exercise_ids: number[]) {
    console.log(`Creating SessionExercises for session ${session_id}...`);

    const createdSessionExercises: { id: number; exercise_id: number }[] = [];

    for (let i = 0; i < exercise_ids.length; i++) {
        const exercise_id = exercise_ids[i];
        try {
            const sessionExercise = await prisma.sessionExercise.create({
                data: {
                    session_id,
                    exercise_id,
                    position: i, // ensures order
                },
            });
            console.log(`Linked exercise ${exercise_id} to session ${session_id} as position ${i}`);
            createdSessionExercises.push({ id: sessionExercise.id, exercise_id });
        } catch (e) {
            console.error(`Error linking exercise ${exercise_id} to session:`, e);
        }
    }

    return createdSessionExercises;
}

export async function runStartupTasks() {
    const categoryMap = await createExerciseCategory();
    await createExercises(categoryMap);
    const defaultUser_id = await createDefaultUser();
    const firstSession_id = await createFirstSession(defaultUser_id);

    if (firstSession_id) {
        const exercises = await prisma.exercise.findMany({ take: 3 });
        const sessionExerciseLinks = await createSessionExercises(firstSession_id, exercises.map(e => e.id));
        await createSets(sessionExerciseLinks);
    }
}
