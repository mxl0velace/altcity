import { error } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    const getArt = async(artId: any) => {
        try {
            const art = await locals.pb.collection('art').getOne(artId, {expand: "artist, users_via_cardcollection"});
            return art;
        } catch (err: any) {
            console.log(err);
            //throw error(err.status, err.message)
        }
    }
    let art = await getArt(params.id);
    return {
        art: art,
        title: art?.title
    }
}