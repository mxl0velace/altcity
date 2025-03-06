import { getImageURL } from '$lib/utils.js';
import { error, isRedirect, redirect } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    const getArt = async(artId: any) => {
        try {
            const art = await locals.pb.collection('art').getOne(artId, {expand: "artist, cardcollection_via_cards.owner"});
            var userWithCollections;
            if (locals.user) {
                userWithCollections = await locals.pb.collection('users').getOne(locals.user.id, {
                    expand: "cardcollection_via_owner.cards, cardcollection_via_editors.cards"
                });
            }
            return {art, userWithCollections};
        } catch (err: any) {
            console.log(err);
            if (err.status == 404) {
                throw error(err.status, "Card with this ID does not exist.")
            }
            //throw error(err.status, err.message)
            return {}
        }
    }
    let {art, userWithCollections} = await getArt(params.id);
    return {
        art: art,
        title: art?.title,
        image: getImageURL(art?.collectionId || "", art?.id || "", art?.image),
        userWithCollections: userWithCollections
    }
}

export const actions = {
    default: async ({request, locals, params}) => {
        if (!locals.user) {
            error(401);
        }
        try {
            let art = await locals.pb.collection('art').getOne(params.id, {expand: "artist"});
            if (!(locals.user.role == "admin" || locals.user.id == art.expand.artist.user)) {
                error(403);
            }
            await locals.pb.collection('art').delete(params.id);
            redirect(303,"/")
        } catch (err) {
            if (isRedirect(err)) {
                throw err
            }
            console.log(error);
            error(403);
        }
    }
}