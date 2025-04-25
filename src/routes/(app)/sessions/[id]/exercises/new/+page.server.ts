import type { Actions } from "./$types";
import prisma from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";

export const load = async () => {
    const exercises = await prisma.exercise.findMany({
        include: { category: true },
    });
    const categories = await prisma.exerciseCategory.findMany();
    return { exercises, categories };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const form = await request.formData();
        const se = await prisma.sessionExercise.create({
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
                session: {
                    connect: {
                        id: parseInt(form.get("session_id") as string),
                    },
                },
                exercise: {
                    connect: {
                        id: parseInt(form.get("exercise_id") as string),
                    },
                },
            },
        });
        throw redirect(303, `/sessions/${se.session_id}/exercises`);
    },
};
