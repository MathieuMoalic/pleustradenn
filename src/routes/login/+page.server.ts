import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const SESSION_COOKIE_NAME = 'session_id';
const SESSION_DURATION_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(303, '/');
    }
    return {};
};


export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
            return fail(400, { username, error: 'Username and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return fail(400, { username, error: 'Incorrect username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return fail(400, { username, error: 'Incorrect username or password' });
        }

        await prisma.userSession.deleteMany({ where: { user_id: user.id } });

        const sessionId = randomUUID(); // Generate a secure random session ID
        const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

        try {
            await prisma.userSession.create({
                data: {
                    id: sessionId,
                    expiresAt: expiresAt,
                    user_id: user.id,
                }
            });
        } catch (err) {
            return fail(500, { username, error: 'Login failed. Please try again.' });
        }

        cookies.set(SESSION_COOKIE_NAME, sessionId, {
            path: '/',               // Available on entire site
            httpOnly: true,          // Not accessible via client-side JS
            sameSite: 'lax',         // Good default for security
            secure: false, // Only send over HTTPS in production
            maxAge: SESSION_DURATION_MS / 1000 // maxAge is in seconds
        });

        throw redirect(303, '/');
    }
};