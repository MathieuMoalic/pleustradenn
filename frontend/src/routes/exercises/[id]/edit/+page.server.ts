import type { Actions, PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        throw error(400, 'Invalid ID');
    }

    const exercise = await prisma.exercise.findUnique({
        where: { id }
    });

    if (!exercise) {
        throw error(404, 'Exercise not found');
    }

    return { exercise };
};

export const actions: Actions = {
    update: async ({ request, params }) => {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            throw error(400, 'Invalid ID');
        }

        const form = await request.formData();

        await prisma.exercise.update({
            where: { id },
            data: {
                name: form.get('name') as string,
                notes: form.get('notes') as string,
                recommended_sets: Number(form.get('recommended_sets')),
                recommended_reps_min: Number(form.get('recommended_reps_min')),
                recommended_reps_max: Number(form.get('recommended_reps_max')),
                recommended_rest_seconds: Number(form.get('recommended_rest_seconds'))
            }
        });

        throw redirect(303, '/exercises');
    },
    delete: async ({ params }) => {
        const id = parseInt(params.id);
        await prisma.exercise.delete({ where: { id } });
        throw redirect(303, '/exercises');
    }
};
