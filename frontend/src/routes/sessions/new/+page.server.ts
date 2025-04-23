import type { Actions } from './$types';
import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { CreateSessionFormData } from '$lib/types';


export const actions: Actions = {
    create: async ({ request }) => {
        const form = await request.formData();

        const rawDate = form.get('date')?.toString();

        if (!rawDate || isNaN(Date.parse(rawDate))) {
            return { error: 'Invalid or missing date' };
        }

        const formData: CreateSessionFormData = {
            date: new Date(rawDate),
            notes: form.get('notes')?.toString() ?? '',
            user_id: 1
        };

        const session = await prisma.session.create({
            data: formData
        });

        throw redirect(303, `/sessions/${session.id}/exercises`);
    }
};

