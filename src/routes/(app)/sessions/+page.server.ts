// src/routes/sessions/+page.server.ts
import type { Actions } from "./$types";
import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login?redirectTo=/sessions');
    }

    const userId = locals.user.id;

    const sessions = await prisma.session.findMany({
        where: {
            user_id: userId,
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

        const userId = locals.user.id;
        let session;

        try {
            session = await prisma.session.create({
                data: {
                    date: new Date(rawDate),
                    notes: notes,
                    user_id: userId,
                    // No need to include Sets here when creating a new session initially
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

        // Redirect to the new session's exercises page (or wherever you manage sets)
        throw redirect(303, `/sessions/${session.id}/exercises`); // Assuming this is the correct path
    },
};
