import { sanitizeString } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({params, url, locals}) => {
    let query = url.searchParams.get('query');
    let squery = sanitizeString(query);

    let results = await locals.pb.collection('art').getList(1,50, {
        filter: `title ~ '${squery}'|| cardname ~ '${squery}'`,
        expand: 'artist, cardcollection_via_cards'
    });

    var userWithCollections;
    try {
        userWithCollections = await locals.pb.collection('users').getOne(locals.user.id, {
            expand: "cardcollection_via_owner.cards"
        })
    } catch (err) {
        console.log(err)
    }


    return {
        query: query,
        results: results,
        userWithCollections: userWithCollections
    };
}) satisfies PageServerLoad;