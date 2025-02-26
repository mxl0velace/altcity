import { getImageURL } from '$lib/utils.js';
import { error } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    const getArt = async(artId: any) => {
        try {
            const art = await locals.pb.collection('art').getOne(artId, {expand: "artist, cardcollection_via_cards.owner"});
            var userWithCollections;
            if (locals.user) {
                userWithCollections = await locals.pb.collection('users').getOne(locals.user.id, {expand: "cardcollection_via_owner.cards, cardcollection_via_editors.cards"});
            }
            return {art, userWithCollections};
        } catch (err: any) {
            console.log(err);
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