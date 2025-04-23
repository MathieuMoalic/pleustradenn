import prisma from '$lib/server/prisma';
import { redirect, type Actions } from '@sveltejs/kit';

export const load = async () => {
    const sessions = await prisma.session.findMany();
    return { sessions };
};


export const actions: Actions = {
    clone: async ({ request }) => {
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
                user_id: 1,
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


        // Redirect to edit page of cloned session
        // throw redirect(303, `/sessions/${cloned.id}/edit`);
    }
};
