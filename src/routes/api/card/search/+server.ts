import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sanitizeString } from '$lib/utils';

export const GET: RequestHandler = async ({locals, params, url}) => {
    var cards;
    var cardName = sanitizeString(url.searchParams.get("cardName"));
    var artistName = sanitizeString(url.searchParams.get("artistName"));
    var filters = url.searchParams.get("filters")?.split(",");
    var page = url.searchParams.get("page") || 1;

    var searchTerms = [];
    if (cardName) {
        searchTerms.push(`(title ~ '${cardName}' || cardname ~ '${cardName}')`);
    }
    if (artistName) {
        searchTerms.push(`artist.name ~ '${artistName}'`);
    }
    if (filters?.includes("verified")) {
        searchTerms.push(`artist.user != null`);
    }

    try {
        cards = await locals.pb.collection('art').getList(page, 42, {
            filter: searchTerms.join(" &&"),
            sort: '-created',
            expand: 'artist, cardcollection_via_cards'
        });
    }
    catch (error) {
        console.log(error)
        cards = {}
    }
    cards.cardNameTerm = cardName;
    cards.artistNameTerm = artistName;
    cards.filtersTerm = filters;
    cards.pageTerm = page;
    return json(cards)
};