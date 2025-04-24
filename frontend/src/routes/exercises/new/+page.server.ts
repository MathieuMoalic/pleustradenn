import type { Actions } from "./$types";
import prisma from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";

export const load = async () => {
    const categories = await prisma.exerciseCategory.findMany();
    return { categories };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const form = await request.formData();
        const name = form.get("name")?.toString() ?? "";
        const notes = form.get("notes")?.toString() ?? "";
        const category_id = parseInt(form.get("category_id") as string);

        await prisma.exercise.create({
            data: {
                name,
                notes,
                category_id,
            },
        });

        throw redirect(303, "/exercises");
    },
};
