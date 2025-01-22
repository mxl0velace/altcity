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

    await locals.pb.collection("users").update(userId,{
        'cardcollection+': params.id 
    })
    return new Response();
};