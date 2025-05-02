import prisma from '$lib/server/prisma';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const categories = await prisma.exerciseCategory.findMany();

    const exercises = await prisma.exercise.findMany({});
    const session = await prisma.session.findUnique({
        where: { id: parseInt(params.id) },
        include: {
            session_exercises: {
                include: {
                    sets: {},
                    exercise: {},
                }
            }
        }
    });
    return { categories, exercises, session };
};

async function create_set(exercise_id: number, session_id: number) {
    console.log(`[create_set] Starting for exercise_id: ${exercise_id}, session_id: ${session_id}`);

    let sessionExercise = await prisma.sessionExercise.findFirst({
        where: {
            session_id: session_id,
            exercise_id: exercise_id,
        },
    });

    if (!sessionExercise) {
        console.log(`[create_set] SessionExercise link not found for session ${session_id}, exercise ${exercise_id}. Creating...`);
        const position = await prisma.sessionExercise.count({
            where: { session_id: session_id }
        });

        sessionExercise = await prisma.sessionExercise.create({
            data: {
                session_id: session_id,
                exercise_id: exercise_id,
                position: position,
            },
        });
        console.log(`[create_set] SessionExercise link created with id: ${sessionExercise.id} and position: ${sessionExercise.position}`);
    } else {
        console.log(`[create_set] SessionExercise link found with id: ${sessionExercise.id}`);
    }

    const currentSessionExerciseId = sessionExercise.id;

    const lastSetForExercise = await prisma.set.findFirst({
        where: {
            exercise_id: exercise_id
        },
        orderBy: {
            created_at: 'desc'
        },
        select: {
            reps: true,
            intensity: true
        }
    });

    let reps = 1;
    let intensity = 0.0;

    if (lastSetForExercise) {
        console.log(`[create_set] Found last set for exercise ${exercise_id}. Suggesting reps: ${lastSetForExercise.reps}, intensity: ${lastSetForExercise.intensity}`);
        reps = lastSetForExercise.reps;
        intensity = lastSetForExercise.intensity;
    } else {
        console.log(`[create_set] No previous sets found for exercise ${exercise_id}. Checking fallback logic.`);
        const fallbackSet = await prisma.set.findFirst({
            where: {
                exercise_id: exercise_id, // <-- FIX: Added exercise_id filter
                reps: { gt: 5 }
            },
            orderBy: {
                intensity: 'desc'
            },
            select: {
                reps: true,
                intensity: true
            }
        });

        if (fallbackSet) {
            console.log(`[create_set] Fallback set found for exercise ${exercise_id}. Suggesting reps: ${fallbackSet.reps}, intensity: ${fallbackSet.intensity}`);
            reps = fallbackSet.reps;
            intensity = fallbackSet.intensity;
        } else {
            console.log(`[create_set] No fallback set found for exercise ${exercise_id}. Using default reps: ${reps}, intensity: ${intensity}`);
        }
    }

    console.log(`[create_set] Final calculated reps: ${reps}, intensity: ${intensity}`);

    const newSetData = {
        session_exercise_id: currentSessionExerciseId,
        exercise_id: exercise_id,
        reps: reps,
        intensity: intensity,
    };

    console.log("[create_set] Creating new set with data:", newSetData);

    try {
        const newSet = await prisma.set.create({ data: newSetData });
        console.log(`[create_set] Successfully created new set with id: ${newSet.id}`);
    } catch (error) {
        console.error("[create_set] Error creating set:", error);
        throw error; // Re-throw the error if needed
    }
}
export const actions: Actions = {
    create_session_exercise: async ({ request, params }) => {
        const session_id = parseInt(params.id as string);
        if (isNaN(session_id)) {
            return fail(400, { error: "Invalid Session ID from URL." });
        }

        const form = await request.formData();
        const exercise_id = parseInt(form.get("exercise_id") as string);

        const session = await prisma.session.findUnique({
            where: { id: session_id },
            include: {
                session_exercises: {}
            }
        });
        if (!session) {
            return fail(404, { error: "Session not found." });
        }
        if (session.session_exercises.some((se) => se.exercise_id === exercise_id)) {
            return fail(400, { error: "Exercise already exists in this session." });
        }
        await create_set(exercise_id, session_id);

    },
    create_set: async ({ request, params }) => {
        const session_id = parseInt(params.id as string);
        if (isNaN(session_id)) {
            return fail(400, { error: "Invalid Session ID from URL." });
        }

        const form = await request.formData();
        const exercise_id = parseInt(form.get("exercise_id") as string);

        await create_set(exercise_id, session_id);
    },
    update_set: async ({ request, params }) => {
        const session_id = parseInt(params.id as string);
        if (isNaN(session_id)) {
            return fail(400, { error: "Invalid Session ID from URL." });
        }

        const form = await request.formData();
        const idString = form.get("id")?.toString();
        if (!idString) {
            return fail(400, { error: "Set ID is missing.", form: Object.fromEntries(form) });
        }
        const id = parseInt(idString);
        if (isNaN(id)) {
            return fail(400, { error: "Invalid Set ID.", form: Object.fromEntries(form) });
        }

        await prisma.set.update({
            where: { id: id },
            data: {
                exercise_id: parseInt(form.get("exercise_id") as string),
                reps: parseInt(form.get("reps") as string),
                intensity: parseFloat(form.get("intensity") as string),
            },
        });
    },
    delete_set: async ({ request, params }) => {
        const form = await request.formData();
        const session_id = parseInt(params.id as string);
        if (isNaN(session_id)) {
            return fail(400, { error: "Invalid Session ID from URL." });
        }

        const idString = form.get("id")?.toString();
        if (!idString) {
            return fail(400, { error: "Set ID is missing for deletion." });
        }
        const id = parseInt(idString);
        if (isNaN(id)) {
            return fail(400, { error: "Invalid Set ID for deletion." });
        }
        let set = await prisma.set.delete({ where: { id } });
        // if the session exercise has no sets, delete the session exercise
        let sessionExercise = await prisma.sessionExercise.findUnique({
            where: { id: set.session_exercise_id }
        });
        if (sessionExercise) {
            let sets = await prisma.set.findMany({
                where: { session_exercise_id: sessionExercise.id }
            });
            if (sets.length === 0) {
                await prisma.sessionExercise.delete({ where: { id: sessionExercise.id } });
            }
        }

    },
    reorder_session_exercises: async ({ request, params }) => {
        const session_id = parseInt(params.id as string);
        const form = await request.formData();
        let exercise_ids = form.get("exercise_ids");
        let exerciseOrderArray: number[];

        if (typeof exercise_ids === "string") {
            exerciseOrderArray = JSON.parse(exercise_ids);
        } else {
            return fail(400, { error: "Invalid exercise order format" });
        }

        const session = await prisma.session.findUnique({
            where: { id: session_id },
            include: {
                session_exercises: true
            }
        });

        if (!session) {
            return fail(404, { error: "Session not found" });
        }

        // Create a map of exercise_id -> sessionExercise.id
        const exerciseToSessionExerciseMap = new Map();
        for (const se of session.session_exercises) {
            exerciseToSessionExerciseMap.set(se.exercise_id, se.id);
        }

        const tempOffset = 1000;

        const tempUpdates = exerciseOrderArray.map((exercise_id, index) => {
            const sessionExerciseId = exerciseToSessionExerciseMap.get(exercise_id);
            if (!sessionExerciseId) {
                throw new Error(`Exercise ID ${exercise_id} not found in session_exercises`);
            }
            return prisma.sessionExercise.update({
                where: { id: sessionExerciseId },
                data: { position: index + tempOffset }
            });
        });

        const finalUpdates = exerciseOrderArray.map((exercise_id, index) => {
            const sessionExerciseId = exerciseToSessionExerciseMap.get(exercise_id);
            return prisma.sessionExercise.update({
                where: { id: sessionExerciseId },
                data: { position: index }
            });
        });

        await prisma.$transaction([...tempUpdates, ...finalUpdates]);
    }

};
