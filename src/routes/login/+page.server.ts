import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto'; // For generating session IDs

const SESSION_COOKIE_NAME = 'session_id';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Redirect logged-in users away from the login page
export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(303, '/'); // Redirect to homepage or dashboard
    }
    return {}; // Must return at least an empty object
};


export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
            return fail(400, { username, error: 'Username and password are required' });
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return fail(400, { username, error: 'Incorrect username or password' });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return fail(400, { username, error: 'Incorrect username or password' });
        }

        // --- Create Session ---
        // 1. Delete any existing sessions for this user (optional, depends on requirements)
        await prisma.userSession.deleteMany({ where: { userId: user.id } });

        // 2. Create new session in DB
        const sessionId = randomUUID(); // Generate a secure random session ID
        const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

        try {
            await prisma.userSession.create({
                data: {
                    id: sessionId,
                    expiresAt: expiresAt,
                    userId: user.id,
                }
            });
        } catch (err) {
            console.error("Failed to create session:", err);
            return fail(500, { username, error: 'Login failed. Please try again.' });
        }

        // 3. Set session cookie
        cookies.set(SESSION_COOKIE_NAME, sessionId, {
            path: '/',               // Available on entire site
            httpOnly: true,          // Not accessible via client-side JS
            sameSite: 'lax',         // Good default for security
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            maxAge: SESSION_DURATION_MS / 1000 // maxAge is in seconds
        });

        // Redirect to a protected page (e.g., dashboard or home)
        throw redirect(303, '/'); // 303 See Other redirect after POST
    }
};