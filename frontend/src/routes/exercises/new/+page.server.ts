import type { Actions } from './$types';
import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
    const exercises = await prisma.exercise.findMany({
        include: { category: true }
    });
    const categories = await prisma.exerciseCategory.findMany();
    return { exercises, categories };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const form = await request.formData();
        const session_id = parseInt(form.get('session_id') as string);
        const exercise_id = parseInt(form.get('exercise_id') as string);
        const sets = parseInt(form.get('sets') as string);
        const reps = parseInt(form.get('reps') as string);
        const weight = parseFloat(form.get('weight') as string);
        const rest_seconds = parseInt(form.get('rest_seconds') as string);
        const count = parseInt(form.get('count') as string);
        const completed = form.get('completed') === 'on';
        const notes = form.get('notes')?.toString() ?? '';

        await prisma.sessionExercise.create({
            data: {
                session_id,
                exercise_id,
                sets,
                reps,
                weight,
                rest_seconds,
                count,
                completed,
                created_at: new Date(),
                success: true,
                notes
            }
        });

        return { success: true };
    }
};
