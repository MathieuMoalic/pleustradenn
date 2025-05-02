import type { Actions } from "./$types";
import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login?redirectTo=/sessions');
    }

    const user_id = locals.user.id;

    const sessions = await prisma.session.findMany({
        where: {
            user_id: user_id,
        },
        orderBy: {
            date: 'desc',
        },
    });

    return {
        sessions: sessions,
        user: locals.user
    };
};


export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in to create a session.' });
        }

        const form = await request.formData();
        const rawDate = form.get("date")?.toString();
        const notes = form.get("notes")?.toString() ?? "";

        if (!rawDate || isNaN(Date.parse(rawDate))) {
            return fail(400, { notes: notes, error: "Invalid or missing date" });
        }

        const user_id = locals.user.id;

        try {
            await prisma.session.create({
                data: {
                    date: new Date(rawDate),
                    notes: notes,
                    user_id: user_id,
                },
            });
        } catch (err) {
            console.error("Error creating session:", err);
            return fail(500, {
                date: rawDate,
                notes: notes,
                error: 'Failed to create session. Please try again.'
            });
        }
    },

    update: async ({ request }) => {
        const form = await request.formData();
        const idString = form.get("id")?.toString();
        if (!idString) {
            return fail(400, { error: "Session ID is missing.", form: Object.fromEntries(form) });
        }
        const id = parseInt(idString);
        if (isNaN(id)) {
            return fail(400, { error: "Invalid Session ID.", form: Object.fromEntries(form) });
        }

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

    },
    delete: async ({ request }) => {
        const form = await request.formData();

        const idString = form.get("id")?.toString();
        if (!idString) {
            return fail(400, { error: "Session ID is missing for deletion." });
        }
        const id = parseInt(idString);
        if (isNaN(id)) {
            return fail(400, { error: "Invalid Session ID for deletion." });
        }
        await prisma.session.delete({ where: { id } });
    },
    clone: async ({ request }) => {
        console.log("todo");
    }
};
