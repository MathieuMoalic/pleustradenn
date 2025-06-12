import type { Actions } from "./$types";
import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) { throw redirect(302, '/login?redirectTo=/sessions'); }

    const user_id = locals.user.id;

    const sessions = await prisma.session.findMany({
        where: { user_id: user_id },
        orderBy: { date: 'desc' }
    });

    return { sessions, user: locals.user };
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

        let session_id: number | null = null;
        try {
            const session = await prisma.session.create({
                data: {
                    date: new Date(rawDate),
                    notes: notes,
                    user_id: user_id,
                },
            });
            session_id = session.id;
        } catch (err) {
            return fail(500, {
                date: rawDate,
                notes: notes,
                error: 'Failed to create session. Please try again.'
            });
        }
        if (session_id !== null) {
            redirect(302, `/sessions/${session_id}`);
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
    clone: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in to clone a session.' });
        }

        const form = await request.formData();
        const sessionIdString = form.get("id")?.toString();
        if (!sessionIdString) {
            return fail(400, { error: "Session ID is missing." });
        }

        const session_id = parseInt(sessionIdString);
        if (isNaN(session_id)) {
            return fail(400, { error: "Invalid session ID." });
        }

        // Fetch session and its exercises
        const sessionToClone = await prisma.session.findUnique({
            where: { id: session_id },
            include: {
                session_exercises: true
            }
        });

        if (!sessionToClone) {
            return fail(404, { error: "Session not found." });
        }

        // Create a new session with today's date and the same notes
        const newSession = await prisma.session.create({
            data: {
                date: new Date(),
                notes: sessionToClone.notes,
                user_id: locals.user.id
            }
        });

        // Clone each session_exercise and create an initial set
        for (const se of sessionToClone.session_exercises) {
            await prisma.sessionExercise.create({
                data: {
                    session_id: newSession.id,
                    exercise_id: se.exercise_id,
                    position: se.position
                }
            });
        }
        console.log("Session cloned successfully.");
    }
};
