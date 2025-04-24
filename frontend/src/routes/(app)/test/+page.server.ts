import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        // Redirect to login, preserving the intended destination
        throw redirect(303, `/login?redirectTo=${url.pathname}`);
    }

    // User is logged in, load data for the dashboard...
    // const dashboardData = await fetchDashboardData(locals.user.id);

    return {
        // dashboardData
        // user: locals.user // Already available from root layout load if needed there
    };
};