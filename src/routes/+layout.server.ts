import type { LayoutServerLoad } from './$types';

export const load = (async ({locals, url}) => {
    return {
        user: locals.user || null,
        toast: url.searchParams.get("status")
    };
}) satisfies LayoutServerLoad;