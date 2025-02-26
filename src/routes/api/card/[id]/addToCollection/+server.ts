import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({request, locals, params}) => {
    let { userId, collectionId } = await request.json();
    if (!locals.user) {
        throw error(401);
    }
    if (locals.user.id != userId) {
        throw error (403);
    }
    var cardCollection;
    try {
        cardCollection = await locals.pb.collection("cardcollection").getOne(collectionId);
    }
    catch (error) {
        cardCollection = null
    }
    if (cardCollection == null) {
        if (locals.user.main_collection == null) {
            const newCollection = await locals.pb.collection("cardcollection").create({
                owner: userId,
                cards: [params.id],
                name: "Owned"
            });
            await locals.pb.collection("users").update(locals.user.id, {
                main_collection: newCollection.id
            })
        } else {
            throw error (404);
        }
    } else {
        await locals.pb.collection("cardcollection").update(cardCollection.id,{
            'cards+': params.id 
        })    
    }
    return new Response();
};