import prisma from '$lib/server/prisma';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals, url }) => {
    if (!locals.user) {
        throw redirect(303, `/login?redirectTo=${url.pathname}`);
    }
    const exercises = await prisma.exercise.findMany({
        where: { user_id: locals.user.id }
    });

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
    if (session.user_id !== locals.user.id) {
        throw new Error('You do not have permission to view this session.');
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
    return { exercises, session };
};


async function get_best_set_for_exercise(exercise_id: number): Promise<{ reps: number; intensity: number }> {
    let bestSet = await prisma.set.findFirst({
        where: {
            exercise_id: exercise_id,
            reps: { gt: 5 }, // only consider sets with more than 5 reps
        },
        orderBy: [
            { intensity: 'desc' },
            { reps: 'desc' }
        ],
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
            orderBy: [
                { intensity: 'desc' },
                { reps: 'desc' }
            ],
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
        include: {
            session_exercises: {
                include: {
                    sets: true
                }
            }
        }
    });

    if (!session) {
        throw new Error("Session not found.");
    }

    // 1. Completed
    const completed = session.session_exercises
        .filter(se => se.completed)
        .sort((a, b) => a.position - b.position);

    // 2. Active with sets
    const activeWithSets = session.session_exercises
        .filter(se => !se.completed && se.sets.length > 0)
        .sort((a, b) => a.position - b.position);

    // 3. No sets
    const noSets = session.session_exercises
        .filter(se => se.sets.length === 0)
        .sort((a, b) => a.position - b.position);

    const sorted = [...completed, ...activeWithSets, ...noSets];
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

    update_session_exercise: async ({ request, locals }) => {
        const form = await request.formData();
        const SEID = parseInt(form.get("id") as string);
        if (isNaN(SEID)) {
            return fail(400, { error: "Invalid Session Exercise ID." });
        }

        const completed = form.get("completed") === "true";

        // check that the session belongs to the current user
        const sessionExercise = await prisma.sessionExercise.findUnique({
            where: { id: SEID },
            include: { session: true }
        });
        if (!locals.user) {
            return fail(401, { error: "You must be logged in to update a session exercise." });
        }
        if (!sessionExercise) {
            return fail(404, { error: "Session Exercise not found." });
        }
        if (sessionExercise.session.user_id !== locals.user.id) {
            return fail(403, { error: "You do not have permission to update this session exercise." });
        }
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

    update_set: async ({ request, params, locals }) => {
        if (!locals.user) {
            return fail(401, { error: "You must be logged in to update a set." });
        }
        const session_id = parseInt(params.id as string);
        if (isNaN(session_id)) {
            return fail(400, { error: "Invalid Session ID from URL." });
        }
        const session = await prisma.session.findUnique({
            where: { id: session_id },
            include: { session_exercises: true }
        });
        if (!session) {
            return fail(404, { error: "Session not found." });
        }
        if (session.user_id !== locals.user.id) {
            return fail(403, { error: "You do not have permission to update this session." });
        }

        const form = await request.formData();
        const SetIdString = form.get("id")?.toString();
        if (!SetIdString) {
            return fail(400, { error: "Set ID is missing.", form: Object.fromEntries(form) });
        }
        const SetId = parseInt(SetIdString);
        if (isNaN(SetId)) {
            return fail(400, { error: "Invalid Set ID.", form: Object.fromEntries(form) });
        }

        let new_set = await prisma.set.update({
            where: { id: SetId },
            data: {
                exercise_id: parseInt(form.get("exercise_id") as string),
                reps: parseInt(form.get("reps") as string),
                intensity: parseFloat(form.get("intensity") as string),
            },
        });
        return { success: true, set: new_set };
    },

    delete_set: async ({ request, params, locals }) => {
        if (!locals.user) {
            return fail(401, { error: "You must be logged in to delete a set." });
        }
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
        const session = await prisma.session.findUnique({
            where: { id: session_id },
            include: { session_exercises: true }
        });
        if (!session) {
            return fail(404, { error: "Session not found." });
        }

        if (session.user_id !== locals.user.id) {
            return fail(403, { error: "You do not have permission to delete this set." });
        }
        await prisma.set.delete({ where: { id } });
        return { success: true };
    },

    delete_session_exercise: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: "You must be logged in to delete a session exercise." });
        }
        const form = await request.formData();
        let id = parseInt(form.get("id") as string);
        if (isNaN(id)) {
            return fail(400, { error: "Session Exercise ID is missing for deletion." });
        }
        const sessionExercise = await prisma.sessionExercise.findUnique({
            where: { id: id },
            include: { sets: true, session: true }
        });
        if (!sessionExercise) {
            return fail(404, { error: "Session Exercise not found." });
        }
        if (sessionExercise.session.user_id !== locals.user.id) {
            return fail(403, { error: "You do not have permission to delete this session exercise." });
        }
        await prisma.set.deleteMany({
            where: { session_exercise_id: sessionExercise.id }
        });
        await prisma.sessionExercise.delete({ where: { id: id } });
        reorder_session_exercises_by_completion(sessionExercise.session_id);
    },

    reorder_session_exercises: async ({ request, params, locals }) => {
        if (!locals.user) {
            return fail(401, { error: "You must be logged in to reorder session exercises." });
        }
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
        if (session.user_id !== locals.user.id) {
            return fail(403, { error: "You do not have permission to reorder this session." });
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

        const sorted = [...done, ...active];
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
