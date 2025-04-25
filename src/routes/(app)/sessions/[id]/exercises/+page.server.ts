import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const exercises = await prisma.sessionExercise.findMany({
        where: {
            session_id: parseInt(params.id)
        },
        include: {
            exercise: true
        }
    });
    return { exercises };
};
