import type { Actions } from "./$types";
import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in to create a session.' });
        }

        const form = await request.formData();

        const rawDate = form.get("date")?.toString();

        if (!rawDate || isNaN(Date.parse(rawDate))) {
            return fail(400, { notes: form.get("notes")?.toString() ?? "", error: "Invalid or missing date" });
        }

        const notes = form.get("notes")?.toString() ?? "";

        const userId = locals.user.id;
        let session_id;
        try {
            const session = await prisma.session.create({
                data: {
                    date: new Date(rawDate),
                    notes: notes,
                    user_id: userId,
                },
            });
            session_id = session.id;


        } catch (err) {
            console.error("Error creating session:", err);
            return fail(500, {
                date: rawDate,
                notes: notes,
                error: 'Failed to create session. Please try again.'
            });
        }
        throw redirect(303, `/sessions/${session_id}/exercises`);
    },
};