import type { Actions, PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        throw error(400, 'Invalid ID');
    }

    const session = await prisma.session.findUnique({
        where: { id }
    });

    if (!session) {
        throw error(404, 'session not found');
    }

    return { session };
};

export const actions: Actions = {
    update: async ({ request, params }) => {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            throw error(400, 'Invalid ID');
        }

        const form = await request.formData();
        const rawDate = form.get('date')?.toString();
        if (!rawDate || isNaN(Date.parse(rawDate))) {
            return { error: 'Invalid or missing date' };
        }

        const formData = {
            date: new Date(rawDate),
            notes: form.get('notes')?.toString() ?? '',
        };

        await prisma.session.update({
            where: { id },
            data: formData
        });

        throw redirect(303, '/sessions');
    },
    delete: async ({ params }) => {
        const id = parseInt(params.id);
        await prisma.session.delete({ where: { id } });
        throw redirect(303, '/sessions');
    }
};
