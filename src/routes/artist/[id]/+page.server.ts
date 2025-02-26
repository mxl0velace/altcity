import { error } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    const getArtist = async(artistId: any) => {
        try {
            const artist = await locals.pb.collection('artist').getOne(artistId, {expand: "art_via_artist"});
            return artist;
        } catch (err: any) {
            console.log(err);
            //throw error(err.status, err.message)
        }
    }
    let artist = await getArtist(params.id)
    return {
        artist: artist,
        title: artist?.name
    };
    /*return {
        artist: getArtist(params.id),
    }*/
}