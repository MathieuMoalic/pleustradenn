// src/routes/actions/set-language/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    const lang = (await request.formData()).get('lang')?.toString();

    if (!locals.user || !lang) {
        return json({ error: 'Invalid request' }, { status: 400 });
    }

    await prisma.user.update({
        where: { id: locals.user.id },
        data: { language: lang }
    });

    return json({ success: true, lang });
};
