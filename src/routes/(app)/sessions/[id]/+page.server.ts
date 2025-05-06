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

async function create_session_exercise_if_not_exists(
    session_id: number,
    exercise_id: number
) {
    let sessionExercise = await prisma.sessionExercise.findFirst({
        where: {
            session_id: session_id,
            exercise_id: exercise_id,
        },
    });

    if (!sessionExercise) {
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
    }

    return sessionExercise;
}

async function get_last_set_for_session_exercise(
    session_exercise_id: number
) {
    return await prisma.set.findFirst({
        where: {
            session_exercise_id: session_exercise_id,
        },
        orderBy: {
            created_at: 'desc',
        },
        select: {
            reps: true,
            intensity: true
        }
    });
}

async function get_last_set_from_prev_session(exercise_id: number) {
    let lastSet = await prisma.set.findFirst({
        where: {
            exercise_id: exercise_id,
            reps: { gt: 5 }, // only consider sets with more than 5 reps
        },
        orderBy: {
            created_at: 'desc',
        },
        select: {
            reps: true,
            intensity: true
        }
    });
    if (!lastSet) {
        // if no set is found for the exercise, create a default set
        lastSet = {
            reps: 1,
            intensity: 0.0
        };
    }

    return lastSet;
}

async function get_last_set(exercise_id: number, session_exercise_id: number) {
    let lastSet = await get_last_set_for_session_exercise(
        session_exercise_id
    );
    // if no set is found for the session exercise, get the last set for the exercise
    // from previous sessions
    if (!lastSet) {
        lastSet = await get_last_set_from_prev_session(exercise_id);
    }
    return lastSet;
}

async function create_set(exercise_id: number, session_id: number) {
    let sessionExercise = await create_session_exercise_if_not_exists(
        session_id,
        exercise_id
    );

    const lastSet = await get_last_set(
        exercise_id,
        sessionExercise.id
    );

    const newSetData = {
        session_exercise_id: sessionExercise.id,
        exercise_id: exercise_id,
        reps: lastSet.reps,
        intensity: lastSet.intensity,
    };

    try {
        await prisma.set.create({ data: newSetData });
    } catch (error) {
        throw error;
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
        console.log("form", form);
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
