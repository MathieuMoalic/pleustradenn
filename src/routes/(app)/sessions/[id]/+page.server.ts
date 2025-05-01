import prisma from '$lib/server/prisma';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { SetWithExercise, GroupedSets } from "$lib/types";

function groupSetsByExercise(sets: SetWithExercise[]): GroupedSets[] {
    const groups = new Map<number, GroupedSets>();

    sets.forEach(set => {
        if (!groups.has(set.exercise.id)) {
            groups.set(set.exercise.id, { exercise: set.exercise, sets: [], id: set.exercise.id });
        }
        groups.get(set.exercise.id)!.sets.push(set);
    });

    return [...groups.values()].map(({ exercise, sets }) => ({
        exercise,
        sets: sets.sort((a, b) => (a.id < 0 && b.id >= 0) ? -1 : (b.id < 0 && a.id >= 0) ? 1 : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
        id: exercise.id
    }));
}


export const load: PageServerLoad = async ({ params }) => {
    const sessionOrders = await prisma.sessionExerciseOrder.findMany({
        where: { sessionId: parseInt(params.id) },
        orderBy: { position: 'asc' }
    });

    const exerciseOrderMap = new Map(sessionOrders.map((o, i) => [o.exerciseId, i]));

    const setList = await prisma.set.findMany({
        where: {
            session_id: parseInt(params.id)
        },
        include: {
            exercise: true
        }
    });
    const categories = await prisma.exerciseCategory.findMany();
    let groupedSets = groupSetsByExercise(setList);

    groupedSets.sort((a, b) => {
        const posA = exerciseOrderMap.get(a.exercise.id) ?? Infinity;
        const posB = exerciseOrderMap.get(b.exercise.id) ?? Infinity;
        return posA - posB;
    });
    const exercises = await prisma.exercise.findMany({});
    const session = await prisma.session.findUnique({
        where: { id: parseInt(params.id) },
    });
    return { groupedSets, categories, exercises, session };
};

export const actions: Actions = {
    create: async ({ request, params }) => {
        const session_id = parseInt(params.id as string);
        if (isNaN(session_id)) {
            return fail(400, { error: "Invalid Session ID from URL." });
        }
        const form = await request.formData();
        const exercise_id = parseInt(form.get("exercise_id") as string);

        // Check if this session already has a set for this exercise
        const existingSet = await prisma.set.findFirst({
            where: {
                session_id: session_id,
                exercise_id: exercise_id
            }
        });

        let new_set;
        if (existingSet) {
            let last_set = await prisma.set.findFirst({
                orderBy: {
                    id: "desc"
                },
                where: {
                    session_id: session_id,
                    exercise_id: exercise_id
                }
            });
            new_set = {
                session_id: session_id,
                exercise_id: exercise_id,
                reps: last_set?.reps || 0,
                intensity: last_set?.intensity || 0
            };
        } else {
            // get the set that has the highest intensity and more than 5 reps
            const last_set = await prisma.set.findFirst({
                orderBy: {
                    intensity: "desc"
                },
                where: {
                    exercise_id: exercise_id,
                    reps: {
                        gt: 5
                    }
                }
            });
            new_set = {
                session_id: session_id,
                exercise_id: exercise_id,
                reps: last_set?.reps || 0,
                intensity: last_set?.intensity || 0
            };
        }

        await prisma.set.create({
            data: new_set
        });
        const existingOrder = await prisma.sessionExerciseOrder.findFirst({
            where: {
                sessionId: session_id,
                exerciseId: exercise_id
            }
        });

        if (!existingOrder) {
            await prisma.sessionExerciseOrder.create({
                data: {
                    sessionId: session_id,
                    exerciseId: exercise_id,
                    position: await prisma.sessionExerciseOrder.count({ where: { sessionId: session_id } })
                }
            });
        }
    },
    update: async ({ request, params }) => {
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
                session_id: session_id,
                exercise_id: parseInt(form.get("exercise_id") as string),
                reps: parseInt(form.get("reps") as string),
                intensity: parseFloat(form.get("intensity") as string),
            },
        });
    },
    delete: async ({ request }) => {
        const form = await request.formData();

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
    reorder: async ({ request, params }) => {
        const sessionId = parseInt(params.id as string);
        const form = await request.formData();
        let exerciseIds = form.get("exerciseIds");
        let exerciseOrderArray: number[];

        if (typeof exerciseIds === "string") {
            exerciseOrderArray = JSON.parse(exerciseIds);
        } else {
            return fail(400, { error: "Invalid exercise order format" });
        }

        // Delete old order, this helps because sometimes the requests bugs out.
        await prisma.sessionExerciseOrder.deleteMany({
            where: { sessionId }
        });

        // Recreate with new positions
        const newOrders = exerciseOrderArray.map((exerciseId: number, index: number) => ({
            sessionId,
            exerciseId,
            position: index
        }));

        await prisma.sessionExerciseOrder.createMany({
            data: newOrders
        });

        return { success: true };
    }
};
