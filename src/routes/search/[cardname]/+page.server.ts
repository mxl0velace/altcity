import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({params, url, locals}) => {
    let query = params.cardname;
    let card;
    try {
        card = await locals.pb.collection('card').getOne(query);
    } catch (err) {
        error(404)
    }

    let results = await locals.pb.collection('art').getList(1,50, {
        filter: `cardname = "${card.name}"`,
        expand: 'artist'
    });

    return {
        query: query,
        results: results,
        card: card
    };
}) satisfies PageServerLoad;