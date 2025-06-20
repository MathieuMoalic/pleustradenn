import prisma from '$lib/server/prisma';
import { validateExerciseFormData } from '$lib/server/validate_exercise';
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    create: async ({ request }) => {
        const form = await request.formData();
        const data = await validateExerciseFormData(form);
        if ('status' in data) {
            return data;
        }
        let exercise;
        try {
            exercise = await prisma.exercise.create({
                data: data,
            });
        } catch (error) {
            return fail(500, { error: "Failed to create exercise. Please try again.", form: Object.fromEntries(form) });
        }
        return { success: true, message: "Exercise created successfully.", exercise: exercise };
    },
};