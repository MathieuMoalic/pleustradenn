import type { Actions } from "./$types";
import prisma from "$lib/server/prisma";
import { fail, type ActionFailure } from "@sveltejs/kit";

export const load = async () => {
    const exercises = await prisma.exercise.findMany({ orderBy: { name: 'asc' } });
    return { exercises };
};

type ExerciseFormData = {
    name: string;
    name_pl: string;
    name_fr: string;
    notes: string;
    intensity_unit: string;
    category: string;
};

async function validateExerciseFormData(form: FormData): Promise<ExerciseFormData | ActionFailure<{ error: string, form?: any }>> {
    const name = form.get("name")?.toString();
    const name_pl = form.get("name_pl")?.toString() ?? "";
    const name_fr = form.get("name_fr")?.toString() ?? "";
    const notes = form.get("notes")?.toString() ?? "";
    const intensity_unit = form.get("intensity_unit")?.toString() ?? "";
    const category = form.get("category")?.toString() ?? "other";

    if (!name || name.trim().length === 0) {
        return fail(400, { error: "Name is required.", form: Object.fromEntries(form) });
    }

    return {
        name: name.trim(),
        name_pl: name_pl.trim(),
        name_fr: name_fr.trim(),
        notes: notes.trim(),
        intensity_unit: intensity_unit.trim(),
        category: category.trim(),
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
            return fail(500, { error: "Failed to create exercise. Please try again.", form: Object.fromEntries(form) });
        }
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
            return fail(500, { error: "Failed to update exercise. Please try again.", form: Object.fromEntries(form) });
        }
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
            if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                return fail(404, { error: "Exercise not found for deletion." });
            }
            return fail(500, { error: "Failed to delete exercise. Please try again." });
        }
    },
};