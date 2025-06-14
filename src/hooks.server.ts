import type { Handle } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import { runStartupTasks } from '$lib/server/startup';
let startupRan = false;
const SESSION_COOKIE_NAME = "session_id";

export const handle: Handle = async ({ event, resolve }) => {
    if (!startupRan) {
        await runStartupTasks();
        startupRan = true;
    }

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
            user: {
                // Include user data if session is valid
                select: { id: true, username: true, language: true }, // Only select needed non-sensitive data
            },
        },
    });

    const allowedLangs = ['en', 'fr', 'pl'] as const;
    type Language = typeof allowedLangs[number];

    if (session && session.expiresAt > new Date()) {
        // Session is valid and not expired
        if (
            session.user &&
            allowedLangs.includes(session.user.language as Language)
        ) {
            event.locals.user = {
                ...session.user,
                language: session.user.language as Language // safely narrowed
            };
            event.locals.sessionId = session.id;
        }
    } else {
        // Session invalid or expired, delete the cookie
        event.cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
        // If session exists in DB but is expired, clean it up (optional)
        if (session) {
            await prisma.userSession
                .delete({ where: { id: sessionId } })
                .catch(() => {
                    /* ignore errors */
                });
        }
    }

    // Proceed with the request
    const response = await resolve(event);

    return response;
};

