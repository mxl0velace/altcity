import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanitizeString } from '$lib/utils';

export const GET: RequestHandler = async ({locals, params}) => {
    var cards;
    var searchTerm = sanitizeString(params.subst);
    try {
        cards = await locals.pb.collection('artist').getList(1, 16, {
            filter: `name ~ '${searchTerm}'`,
        });
    }
    catch (error) {
        console.log(error)
        cards = null
    }
    return json(cards)
};