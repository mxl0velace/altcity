import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({request, locals, params}) => {
    let { userId, collectionId } = await request.json();
    if (!locals.user) {
        throw error(401);
    }
    if (locals.user.id != userId) {
        throw error (403);
    }

    const cardCollection = await locals.pb.collection("cardcollection").getOne(collectionId);
    if (cardCollection == null) {
        throw error (404);
    }
    await locals.pb.collection("cardcollection").update(cardCollection.id,{
        'cards-': params.id 
    })
    return new Response();
};