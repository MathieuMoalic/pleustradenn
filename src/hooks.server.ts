import type { Handle } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

const SESSION_COOKIE_NAME = 'session_id';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get(SESSION_COOKIE_NAME);

    // Clear user locals initially
    event.locals.user = null;
    event.locals.sessionId = null;

    if (!sessionId) {
        // No session ID cookie, proceed as logged-out user
        return await resolve(event);
    }

    // Find the session in the database
    const session = await prisma.userSession.findUnique({
        where: { id: sessionId },
        include: {
            user: { // Include user data if session is valid
                select: { id: true, username: true } // Only select needed non-sensitive data
            }
        }
    });

    if (session && session.expiresAt > new Date()) {
        // Session is valid and not expired
        if (session.user) {
            event.locals.user = session.user; // Attach user to locals
            event.locals.sessionId = session.id; // Attach session ID for potential refresh
        }
    } else {
        // Session invalid or expired, delete the cookie
        event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
        // If session exists in DB but is expired, clean it up (optional)
        if (session) {
            await prisma.userSession.delete({ where: { id: sessionId } }).catch(() => { /* ignore errors */ });
        }
    }

    // Proceed with the request
    const response = await resolve(event);
    return response;
};