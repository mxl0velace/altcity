import { error, json, type RequestHandler } from '@sveltejs/kit';
import { sanitizeString } from '$lib/utils';

export const GET: RequestHandler = async ({locals, params, url}) => {
    var artists;
    var artistName = sanitizeString(url.searchParams.get("artistName"));
    var filters = url.searchParams.get("filters")?.split(",");
    var page = url.searchParams.get("page") || 1;

    var searchTerms = [];
    if (artistName) {
        searchTerms.push(`name ~ '${artistName}'`);
    }
    if (filters?.includes("verified")) {
        searchTerms.push(`user != null`);
    }

    try {
        artists = await locals.pb.collection('artist').getList(page, 50, {
            filter: searchTerms.join(" &&"),
            sort: '-created',
        });
    }
    catch (error) {
        console.log(error)
        artists = {}
    }
    artists.artistNameTerm = artistName;
    artists.pageTerm = page;
    artists.filterTerm = filters;
    return json(artists)
};