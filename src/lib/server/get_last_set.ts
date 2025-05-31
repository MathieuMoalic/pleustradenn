import prisma from '$lib/server/prisma';

async function get_last_set_for_session_exercise(
    session_exercise_id: number
) {
    return await prisma.set.findFirst({
        where: {
            session_exercise_id: session_exercise_id,
        },
        orderBy: {
            created_at: 'desc',
        },
        select: {
            reps: true,
            intensity: true
        }
    });
}

async function get_last_set_from_prev_session(exercise_id: number) {
    let lastSet = await prisma.set.findFirst({
        where: {
            exercise_id: exercise_id,
            reps: { gt: 5 }, // only consider sets with more than 5 reps
        },
        orderBy: {
            created_at: 'desc',
        },
        select: {
            reps: true,
            intensity: true
        }
    });
    if (!lastSet) {
        // if no set is found for the exercise, create a default set
        lastSet = {
            reps: 1,
            intensity: 0.0
        };
    }

    return lastSet;
}

export async function get_last_set(exercise_id: number, session_exercise_id: number) {
    let lastSet = await get_last_set_for_session_exercise(
        session_exercise_id
    );
    // if no set is found for the session exercise, get the last set for the exercise
    // from previous sessions
    if (!lastSet) {
        lastSet = await get_last_set_from_prev_session(exercise_id);
    }
    return lastSet;
}
