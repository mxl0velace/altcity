import { sanitizeString } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({params, url, locals}) => {
    let query = url.searchParams.get('query');
    let squery = sanitizeString(query);

    let results = await locals.pb.collection('art').getList(1,50, {
        filter: `title ~ '${squery}'|| cardname ~ '${squery}'`,
        expand: 'artist'
    });

    return {
        query: query,
        results: results
    };
}) satisfies PageServerLoad;