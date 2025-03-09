import { error } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    const getAllArtists = async() => {
        try {
            const artists = await locals.pb.collection('artist').getList(1,42,{
                sort: '-created'
            });
            return artists;
        } catch (err: any) {
            console.log(err);
            //throw error(err.status, err.message)
        }
    }
    return {
        artists: await getAllArtists(),
        title: "Artists"
    }
}