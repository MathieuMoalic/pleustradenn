import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import bcrypt from 'bcrypt';

import { ALLOW_REGISTRATION } from '$env/static/private';


export const actions: Actions = {
    default: async ({ request }) => {

        if (ALLOW_REGISTRATION === 'false') {
            return fail(403, {
                error: 'New user registration is currently disabled.'
            });
        }


        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (!username || typeof username !== 'string' || username.length < 3) {
            return fail(400, { username, error: 'Username must be at least 3 characters long' });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return fail(400, { username, error: 'Password must be at least 6 characters long' });
        }

        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return fail(400, { username, error: 'Username already taken' });
        }

        const passwordHash = await bcrypt.hash(password, 10); // 10 is the salt rounds

        try {
            await prisma.user.create({
                data: {
                    username: username,
                    password_hash: passwordHash,
                }
            });
        } catch (err) {
            return fail(500, { username, error: 'Failed to create user. Please try again.' });
        }

        throw redirect(303, '/login?registered=true');
    }
};