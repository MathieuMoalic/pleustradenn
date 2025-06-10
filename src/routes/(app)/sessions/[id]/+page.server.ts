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
                    sets: true,
                    exercise: true
                }
            }
        }
    });

    if (!session) {
        throw new Error('Session not found.');
    }

    for (const se of session.session_exercises) {
        if (se.sets.length === 0) {
            let getLastSet = await get_best_set_for_exercise(se.exercise.id);
            if (!getLastSet) {
                getLastSet = { reps: 0, intensity: 0 };
            }
            se.sets.push({
                id: -1 * se.id, // negative ID to indicate it's a placeholder
                exercise_id: se.exercise.id,
                session_exercise_id: se.id,
                reps: getLastSet.reps,
                intensity: getLastSet.intensity,
                created_at: new Date(),
            });
        }
    }
    return { categories, exercises, session };
};


async function get_best_set_for_exercise(exercise_id: number): Promise<{ reps: number; intensity: number }> {
    let bestSet = await prisma.set.findFirst({
        where: {
            exercise_id: exercise_id,
            reps: { gt: 5 }, // only consider sets with more than 5 reps
        },
        orderBy: {
            intensity: 'desc',
        },
        select: {
            reps: true,
            intensity: true
        }
    });
    // If no set is found for reps > 5, return the highest intensity set
    if (!bestSet) {
        bestSet = await prisma.set.findFirst({
            where: {
                exercise_id: exercise_id
            },
            orderBy: {
                intensity: 'desc'
            },
            select: {
                reps: true,
                intensity: true
            }
        });
    }
    // if there is still no set found, return a default set
    if (!bestSet) {
        return {
            reps: 1,
            intensity: 0.0
        };
    }

    return bestSet;
}

async function reorder_session_exercises_by_completion(session_id: number) {
    const session = await prisma.session.findUnique({
        where: { id: session_id },
        include: { session_exercises: true }
    });

    if (!session) {
        throw new Error("Session not found.");
    }

    const active = session.session_exercises
        .filter(se => !se.completed)
        .sort((a, b) => a.position - b.position);

    const done = session.session_exercises
        .filter(se => se.completed)
        .sort((a, b) => a.position - b.position);

    const sorted = [...active, ...done];
    const tempOffset = 1000;

    const tempUpdates = sorted.map((se, index) =>
        prisma.sessionExercise.update({
            where: { id: se.id },
            data: { position: index + tempOffset }
        })
    );

    const finalUpdates = sorted.map((se, index) =>
        prisma.sessionExercise.update({
            where: { id: se.id },
            data: { position: index }
        })
    );

    await prisma.$transaction([...tempUpdates, ...finalUpdates]);
}

export const actions: Actions = {
    create_session_exercise: async ({ request, params }) => {
        console.log("Creating session exercise");
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
        const newSessionExercise = await prisma.sessionExercise.create({
            data: {
                session_id: session_id,
                exercise_id: exercise_id,
                position: session.session_exercises.length
            },
            include: {
                sets: true,
                exercise: true
            }
        });
        if (!newSessionExercise) {
            return fail(500, { error: "Failed to create session exercise." });
        }
        await reorder_session_exercises_by_completion(session_id);
    },

    update_session_exercise: async ({ request }) => {
        const form = await request.formData();
        const SEID = parseInt(form.get("id") as string);
        if (isNaN(SEID)) {
            return fail(400, { error: "Invalid Session Exercise ID." });
        }

        const completed = form.get("completed") === "true";

        const updatedSE = await prisma.sessionExercise.update({
            where: { id: SEID },
            data: { completed }
        });

        await reorder_session_exercises_by_completion(updatedSE.session_id);
    },

    create_set: async ({ request, params }) => {
        const session_id = parseInt(params.id as string);
        if (isNaN(session_id)) {
            return fail(400, { error: "Invalid Session ID from URL." });
        }

        const form = await request.formData();
        const exercise_id = parseInt(form.get("exercise_id") as string);
        const session_exercise_id = parseInt(form.get("session_exercise_id") as string);

        let lastSet = await prisma.set.findFirst({
            where: {
                session_exercise_id: session_exercise_id,
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
        if (!lastSet) {
            lastSet = await get_best_set_for_exercise(exercise_id);
        }
        if (!lastSet) {
            lastSet = { reps: 0, intensity: 0 };
        }

        const newSetData = {
            session_exercise_id: session_exercise_id,
            exercise_id: exercise_id,
            reps: lastSet?.reps || 0,
            intensity: lastSet?.intensity || 0,
        };

        let createdSet = await prisma.set.create({ data: newSetData });
        if (!createdSet) {
            return fail(500, { error: "Failed to create set." });
        }
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
        await prisma.set.delete({ where: { id } });
    },

    delete_session_exercise: async ({ request, params }) => {
        const form = await request.formData();
        let id = parseInt(form.get("id") as string);

        if (isNaN(id)) {
            return fail(400, { error: "Invalid Session Exercise ID for deletion." });
        }
        const sessionExercise = await prisma.sessionExercise.findUnique({
            where: { id: id },
            include: { sets: true }
        });
        if (!sessionExercise) {
            return fail(404, { error: "Session Exercise not found." });
        }
        await prisma.set.deleteMany({
            where: { session_exercise_id: sessionExercise.id }
        });
        await prisma.sessionExercise.delete({ where: { id: id } });
    },

    reorder_session_exercises: async ({ request, params }) => {
        const session_id = parseInt(params.id as string);
        if (isNaN(session_id)) {
            return fail(400, { error: "Invalid Session ID from URL." });
        }

        const form = await request.formData();
        const raw = form.get("exercise_ids");
        if (typeof raw !== "string") {
            return fail(400, { error: "Invalid exercise order format." });
        }

        const exerciseOrderArray: number[] = JSON.parse(raw);

        const session = await prisma.session.findUnique({
            where: { id: session_id },
            include: { session_exercises: true }
        });

        if (!session) {
            return fail(404, { error: "Session not found." });
        }

        const exerciseToSE = new Map<number, typeof session.session_exercises[number]>();
        for (const se of session.session_exercises) {
            exerciseToSE.set(se.exercise_id, se);
        }

        const active: typeof session.session_exercises = [];
        const done: typeof session.session_exercises = [];

        for (const exercise_id of exerciseOrderArray) {
            const se = exerciseToSE.get(exercise_id);
            if (!se) continue;
            (se.completed ? done : active).push(se);
        }

        const sorted = [...active, ...done];
        const tempOffset = 1000;

        const tempUpdates = sorted.map((se, index) =>
            prisma.sessionExercise.update({
                where: { id: se.id },
                data: { position: index + tempOffset }
            })
        );

        const finalUpdates = sorted.map((se, index) =>
            prisma.sessionExercise.update({
                where: { id: se.id },
                data: { position: index }
            })
        );

        await prisma.$transaction([...tempUpdates, ...finalUpdates]);
    }
};
