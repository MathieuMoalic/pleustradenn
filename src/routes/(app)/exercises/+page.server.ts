import prisma from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
    if (!locals.user) {
        throw redirect(303, `/login?redirectTo=${url.pathname}`);
    }
    const exercises = await prisma.exercise.findMany({
        where: { user_id: locals.user.id },
        orderBy: { name: 'asc' }
    });
    return { exercises };
};
