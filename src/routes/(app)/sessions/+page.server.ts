import prisma from '$lib/server/prisma';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login?redirectTo=/sessions');
    }
    const userId = locals.user.id;
    const sessions = await prisma.session.findMany({
        where: { user_id: userId },
        orderBy: { date: 'desc' },
    });
    return { sessions: sessions };
};

export const actions: Actions = {
    clone: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in to create a session.' });
        }
        const form = await request.formData();
        const sessionId = parseInt(form.get('session_id') as string);

        if (isNaN(sessionId)) {
            return { error: 'Invalid session ID' };
        }

        const original = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { sessionExercises: true }
        });

        if (!original) {
            return { error: 'Session not found' };
        }

        const cloned = await prisma.session.create({
            data: {
                date: new Date(),
                notes: original.notes,
                user_id: locals.user.id,
                sessionExercises: {}
            }
        });
        for (const exercise of original.sessionExercises) {
            await prisma.sessionExercise.create({
                data: {
                    session_id: cloned.id,
                    exercise_id: exercise.exercise_id,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    weight: exercise.weight,
                    rest_seconds: exercise.rest_seconds,
                    count: exercise.count,
                    completed: exercise.completed,
                    created_at: new Date(),
                    success: exercise.success,
                    notes: exercise.notes
                }
            });
        }


        throw redirect(303, `/sessions/${cloned.id}/edit`);
    }
};
