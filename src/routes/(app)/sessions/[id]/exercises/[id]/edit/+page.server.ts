import type { Actions, PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";
import { error, redirect } from "@sveltejs/kit";
import type { SessionExerciseFormData } from "$lib/types";
import type { Exercise } from "@prisma/client";

export const load: PageServerLoad = async ({
    params,
}): Promise<{ sessionExercise: SessionExerciseFormData; exercises: Exercise[] }> => {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        throw error(400, "Invalid ID");
    }

    const sessionExercise = await prisma.sessionExercise.findUnique({
        where: { id },
        include: {
            exercise: true,
        },
    });

    if (!sessionExercise) {
        throw error(404, "Exercise not found");
    }

    const exercises = await prisma.exercise.findMany();
    return { sessionExercise, exercises };
};

export const actions: Actions = {
    update: async ({ request, params }) => {
        const sessionExerciseID = parseInt(params.id);

        if (isNaN(sessionExerciseID)) {
            throw error(400, "Invalid ID");
        }

        const form = await request.formData();
        const se = await prisma.sessionExercise.update({
            where: { id: sessionExerciseID },
            data: {
                sets: parseInt(form.get("sets") as string),
                reps: parseInt(form.get("reps") as string),
                weight: parseFloat(form.get("weight") as string),
                rest_seconds: parseInt(form.get("rest_seconds") as string),
                count: parseInt(form.get("count") as string),
                completed: true,
                created_at: new Date(),
                success: true,
                notes: form.get("notes") as string,
            },
        });
        throw redirect(303, `/sessions/${se.session_id}/exercises`);
    },
    delete: async ({ params }) => {
        const id = parseInt(params.id);
        const se = await prisma.sessionExercise.delete({
            where: { id },
        });
        throw redirect(303, `/sessions/${se.session_id}/exercises`);
    },
};
