import prisma from '$lib/server/prisma';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { SetWithExercise, GroupedSets } from "$lib/types";

function groupSetsByExercise(sets: SetWithExercise[]): GroupedSets[] {
    const groups = new Map<number, GroupedSets>();

    sets.forEach(set => {
        if (!groups.has(set.exercise.id)) {
            groups.set(set.exercise.id, { exercise: set.exercise, sets: [] });
        }
        groups.get(set.exercise.id)!.sets.push(set);
    });

    return [...groups.values()].map(({ exercise, sets }) => ({
        exercise,
        sets: sets.sort((a, b) => (a.id < 0 && b.id >= 0) ? -1 : (b.id < 0 && a.id >= 0) ? 1 : new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }));
}


export const load: PageServerLoad = async ({ params }) => {
    const setList = await prisma.set.findMany({
        where: {
            session_id: parseInt(params.id)
        },
        include: {
            exercise: true
        }
    });

    let groupedSets = groupSetsByExercise(setList);
    return { groupedSets };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const form = await request.formData();
        console.log("Form data:", Object.fromEntries(form));
        const session_id = form.get("session_id")?.toString();
        const exerciseIdString = form.get("exercise_id")?.toString();
        let last_set = await prisma.set.findFirst({
            orderBy: {
                id: "desc"
            },
            where: {
                session_id: parseInt(session_id as string),
                exercise_id: parseInt(exerciseIdString as string)
            }
        });
        let new_set = {
            session_id: parseInt(session_id as string),
            exercise_id: parseInt(exerciseIdString as string),
            reps: last_set?.reps || 0,
            intensity: last_set?.intensity || 0
        };
        await prisma.set.create({
            data: new_set
        });
    },
    update: async ({ request }) => {
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
                session_id: parseInt(form.get("session_id") as string),
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
};
