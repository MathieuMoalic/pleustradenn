import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

const SESSION_COOKIE_NAME = 'session_id';

export const actions: Actions = {
    default: async ({ cookies, locals }) => {
        const sessionId = locals.sessionId; // Get sessionId from hooks

        if (sessionId) {
            // Delete session from database
            await prisma.userSession.delete({ where: { id: sessionId } }).catch(() => { /* ignore errors */ });
            // Delete cookie
            cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
        }

        // Clear locals just in case (though hooks will handle on next request)
        locals.user = null;
        locals.sessionId = null;

        // Redirect to login or home page
        throw redirect(303, '/login');
    }
};
