import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // locals.user is populated by the hooks.server.ts
    return {
        user: locals.user
    };
};
//Now, $page.data.user will be available in your Svelte components within that layout. 