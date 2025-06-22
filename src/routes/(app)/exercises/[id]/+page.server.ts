import prisma from '$lib/server/prisma';
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';
import { validateExerciseFormData } from '$lib/server/validate_exercise';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url, params }) => {
    if (!locals.user) {
        throw redirect(303, `/login?redirectTo=${url.pathname}`);
    }
    const { id } = params;
    const exercise_id = Number(id);
    if (isNaN(exercise_id)) {
        throw new Error('Invalid exercise ID');
    }
    let sets = await prisma.set.findMany({
        where: {
            exercise_id: exercise_id,
        },
        orderBy: {
            created_at: 'desc',
        },
        select: {
            reps: true,
            intensity: true,
            created_at: true,
            session_exercise_id: true,
        },
    });
    type SetItem = {
        reps: number;
        intensity: number;
        created_at: Date;
        session_exercise_id: number;
    };


    // Group sets by session_exercise_id, then return as a list of lists
    const groupedMap = new Map<number, SetItem[]>();

    for (const set of sets) {
        if (!groupedMap.has(set.session_exercise_id)) {
            groupedMap.set(set.session_exercise_id, []);
        }
        groupedMap.get(set.session_exercise_id)!.push(set);
    }

    const groupedSets = Array.from(groupedMap.values());


    let exercise = await prisma.exercise.findUnique({
        where: {
            id: exercise_id,
        },
    });

    if (!exercise) {
        throw new Error('Exercise not found');
    }
    if (exercise.user_id !== locals.user.id) {
        throw new Error('You do not have permission to view this exercise.');
    }
    return { sets: groupedSets, exercise };
}

export const actions: Actions = {
    update: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in to update an exercise.' });
        }

        const form = await request.formData();
        const idString = form.get("id")?.toString();
        if (!idString) {
            return fail(400, { error: "Exercise ID is missing.", form: Object.fromEntries(form) });
        }

        const id = parseInt(idString);
        if (isNaN(id)) {
            return fail(400, { error: "Invalid exercise ID.", form: Object.fromEntries(form) });
        }

        // 🔐 Check that the exercise belongs to the current user
        const existing = await prisma.exercise.findUnique({
            where: { id },
            select: { user_id: true },
        });

        if (!existing) {
            return fail(404, { error: "Exercise not found.", form: Object.fromEntries(form) });
        }

        if (existing.user_id !== locals.user.id) {
            return fail(403, { error: "You do not have permission to update this exercise.", form: Object.fromEntries(form) });
        }

        const validationResult = await validateExerciseFormData(form);
        if ('status' in validationResult) {
            return validationResult;
        }

        const validatedData = validationResult;

        try {
            const exercise = await prisma.exercise.update({
                where: { id },
                data: validatedData,
            });
            return { success: true, message: "Exercise updated successfully.", exercise };
        } catch (error) {
            return fail(500, { error: "Failed to update exercise.", form: Object.fromEntries(form) });
        }
    },


    delete: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in to delete an exercise.' });
        }

        const form = await request.formData();
        const idString = form.get("id")?.toString();
        if (!idString) {
            return fail(400, { error: "Exercise ID is missing for deletion." });
        }

        const id = parseInt(idString);
        if (isNaN(id)) {
            return fail(400, { error: "Invalid exercise ID for deletion." });
        }

        // First, fetch the exercise to ensure it exists and belongs to the user
        const existing = await prisma.exercise.findUnique({
            where: { id },
            select: { user_id: true },
        });

        if (!existing) {
            return fail(404, { error: "Exercise not found for deletion." });
        }

        if (existing.user_id !== locals.user.id) {
            return fail(403, { error: "You do not have permission to delete this exercise." });
        }

        try {
            await prisma.exercise.delete({ where: { id } });
        } catch (error) {
            return fail(500, { error: "Failed to delete exercise. Please try again." });
        }

        return { success: true, message: "Exercise deleted successfully." };
    },

};