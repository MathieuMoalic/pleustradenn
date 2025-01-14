import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token');

    if (!token && event.url.pathname !== '/login') {
        return Response.redirect('/login', 302);
    }

    return resolve(event);
};
