import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { sanitizeString } from '$lib/utils.js';

export const load = (async ({params, url, locals}) => {
    let query = params.cardname;
    let card;
    try {
        card = await locals.pb.collection('card').getOne(query);
    } catch (err) {
        error(404)
    }

    let results = await locals.pb.collection('art').getList(1,42, {
        filter: `cardname = '${sanitizeString(card.name)}'`,
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
        card: card,
        userWithCollections: userWithCollections
    };
}) satisfies PageServerLoad;