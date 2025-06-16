import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;
    // convert to number and validate
    const exercise_id = Number(id);
    if (isNaN(exercise_id)) {
        throw new Error('Invalid exercise ID');
    }
    let sets = await prisma.set.findMany({
        where: {
            exercise_id: exercise_id,
        },
        orderBy: {
            created_at: 'desc',
        },
        select: {
            reps: true,
            intensity: true,
            created_at: true,
            session_exercise_id: true,
        },
    });
    type SetItem = {
        reps: number;
        intensity: number;
        created_at: Date;
        session_exercise_id: number;
    };


    // Group sets by session_exercise_id, then return as a list of lists
    const groupedMap = new Map<number, SetItem[]>();

    for (const set of sets) {
        if (!groupedMap.has(set.session_exercise_id)) {
            groupedMap.set(set.session_exercise_id, []);
        }
        groupedMap.get(set.session_exercise_id)!.push(set);
    }

    const groupedSets = Array.from(groupedMap.values());


    let exercise = await prisma.exercise.findUnique({
        where: {
            id: exercise_id,
        },
    });

    return { sets: groupedSets, exercise };
}