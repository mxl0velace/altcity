import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanitizeString } from '$lib/utils';

export const GET: RequestHandler = async ({locals, params}) => {
    var cards;
    var searchTerm = sanitizeString(params.subst);
    try {
        cards = await locals.pb.collection('card').getList(1, 8, {
            filter: `name ~ '${searchTerm}'`,
        });
    }
    catch (error) {
        console.log(error)
        cards = null
    }
    return json(cards)
};