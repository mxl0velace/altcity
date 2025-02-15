import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({request, locals, params}) => {
    let { userId } = await request.json();
    if (!locals.user) {
        throw error(401);
    }
    if (locals.user.id != userId) {
        throw error (403);
    }
    var cardCollection;
    try {
        cardCollection = await locals.pb.collection("cardcollection").getFirstListItem(`owner.id = "${userId}"`)
    }
    catch (error) {
        cardCollection = null
    }
    if (cardCollection == null) {
        await locals.pb.collection("cardcollection").create({
            owner: userId,
            cards: [params.id]
        })
    } else {
        await locals.pb.collection("cardcollection").update(cardCollection.id,{
            'cards+': params.id 
        })    
    }
    return new Response();
};