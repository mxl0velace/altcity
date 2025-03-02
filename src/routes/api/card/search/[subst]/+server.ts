import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({locals, params}) => {
    var cards;
    var searchTerm = params.subst.replace("'", "\\'");
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