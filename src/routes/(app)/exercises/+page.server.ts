import prisma from "$lib/server/prisma";

export const load = async () => {
    const exercises = await prisma.exercise.findMany({ orderBy: { name: 'asc' } });
    return { exercises };
};
