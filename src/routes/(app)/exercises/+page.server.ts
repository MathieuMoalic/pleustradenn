import type { Actions } from "./$types";
import prisma from "$lib/server/prisma";
import { fail, redirect, type ActionFailure } from "@sveltejs/kit";

export const load = async () => {
    const exercises = await prisma.exercise.findMany();
    const categories = await prisma.exerciseCategory.findMany();
    return { exercises, categories };
};

type ExerciseFormData = {
    name: string;
    notes: string;
    intensity_unit: string;
    category_id: number;
};

async function validateExerciseFormData(form: FormData): Promise<ExerciseFormData | ActionFailure<{ error: string, form?: any }>> {
    const name = form.get("name")?.toString();
    const notes = form.get("notes")?.toString() ?? ""; // Notes can be empty
    const intensity_unit = form.get("intensity_unit")?.toString() ?? ""; // intensity_unit can be empty
    const categoryIdString = form.get("category_id")?.toString();

    if (!name || name.trim().length === 0) {
        return fail(400, { error: "Name is required.", form: Object.fromEntries(form) });
    }

    if (!categoryIdString) {
        return fail(400, { error: "Category is required.", form: Object.fromEntries(form) });
    }

    const category_id = parseInt(categoryIdString);

    if (isNaN(category_id)) {
        return fail(400, { error: "Invalid category ID.", form: Object.fromEntries(form) });
    }

    const categoryExists = await prisma.exerciseCategory.findUnique({
        where: { id: category_id }
    });

    if (!categoryExists) {
        return fail(400, { error: "Selected category does not exist.", form: Object.fromEntries(form) });
    }

    return {
        name: name.trim(),
        notes: notes.trim(),
        intensity_unit: intensity_unit.trim(),
        category_id: category_id,
    };
}

export const actions: Actions = {
    create: async ({ request }) => {
        const form = await request.formData();
        const validationResult = await validateExerciseFormData(form);

        if ('status' in validationResult) {
            return validationResult;
        }

        const validatedData = validationResult;

        try {
            await prisma.exercise.create({
                data: validatedData,
            });
        } catch (error) {
            console.error("Error creating exercise:", error);
            return fail(500, { error: "Failed to create exercise. Please try again.", form: Object.fromEntries(form) });
        }

        throw redirect(303, "/exercises");
    },

    update: async ({ request }) => {
        const form = await request.formData();
        const idString = form.get("id")?.toString();
        if (!idString) {
            return fail(400, { error: "Exercise ID is missing.", form: Object.fromEntries(form) });
        }
        const id = parseInt(idString);
        if (isNaN(id)) {
            return fail(400, { error: "Invalid exercise ID.", form: Object.fromEntries(form) });
        }

        const validationResult = await validateExerciseFormData(form);

        if ('status' in validationResult) {
            return validationResult;
        }

        const validatedData = validationResult;

        try {
            await prisma.exercise.update({
                where: { id },
                data: validatedData,
            });
        } catch (error) {
            console.error("Error updating exercise:", error);
            return fail(500, { error: "Failed to update exercise. Please try again.", form: Object.fromEntries(form) });
        }

        throw redirect(303, "/exercises");
    },

    delete: async ({ request }) => {
        const form = await request.formData();

        const idString = form.get("id")?.toString();
        if (!idString) {
            return fail(400, { error: "Exercise ID is missing for deletion." });
        }
        const id = parseInt(idString);
        if (isNaN(id)) {
            return fail(400, { error: "Invalid exercise ID for deletion." });
        }

        try {
            await prisma.exercise.delete({ where: { id } });
        } catch (error) {
            console.error("Error deleting exercise:", error);
            if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                return fail(404, { error: "Exercise not found for deletion." });
            }
            return fail(500, { error: "Failed to delete exercise. Please try again." });
        }

        throw redirect(303, "/exercises");
    },
};