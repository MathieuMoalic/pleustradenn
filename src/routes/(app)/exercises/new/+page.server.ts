import prisma from '$lib/server/prisma';
import { validateExerciseFormData } from '$lib/server/validate_exercise';
import { redirect } from '@sveltejs/kit';
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in to create an exercise.' });
        }

        const user_id = locals.user.id;

        const form = await request.formData();
        let data = await validateExerciseFormData(form);
        if ('status' in data) {
            return data;
        }
        let exercise;
        try {
            exercise = await prisma.exercise.create({
                data: {
                    ...data,
                    user_id: user_id,
                },
            });
        } catch (error) {
            return fail(500, { error: "Failed to create exercise. Please try again.", form: Object.fromEntries(form) });
        }
        return { success: true, message: "Exercise created successfully.", exercise: exercise };
    },
};