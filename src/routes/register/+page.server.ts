// src/routes/register/+page.server.ts
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import bcrypt from 'bcrypt';

// Import the environment variable
// Make sure you have ALLOW_REGISTRATION=false or ALLOW_REGISTRATION=true
// set in your .env file (or environment variables during deployment)
import { ALLOW_REGISTRATION } from '$env/static/private';


export const actions: Actions = {
    default: async ({ request }) => {

        // --- Add this check at the beginning ---
        // Environment variables are strings, so compare to 'false'
        if (ALLOW_REGISTRATION === 'false') {
            // Return a 403 Forbidden status with an informative error message
            return fail(403, {
                error: 'New user registration is currently disabled.'
                // You might also include the submitted username if you want,
                // but it's not strictly necessary for a disabled feature response
                // username: data.get('username') // if you want to preserve the input
            });
        }
        // --- End of the check ---


        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (!username || typeof username !== 'string' || username.length < 3) {
            return fail(400, { username, error: 'Username must be at least 3 characters long' });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return fail(400, { username, error: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return fail(400, { username, error: 'Username already taken' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create user
        try {
            await prisma.user.create({
                data: {
                    username: username,
                    password_hash: passwordHash,
                }
            });
        } catch (err) {
            console.error(err);
            return fail(500, { username, error: 'Failed to create user. Please try again.' });
        }

        // Redirect to login page after successful registration
        throw redirect(303, '/login?registered=true'); // 303 See Other redirect after POST
    }
};