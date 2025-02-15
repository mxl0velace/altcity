import type { PageServerLoad } from './$types';

export const load = (async ({params, url, locals}) => {

    let results = await locals.pb.collection('adminAttributes').getList(1,50, {
        expand: 'valueCard, valueCollection, valueArtist'
    });

    return {
        results: results
    };
}) satisfies PageServerLoad;