import { error } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    const getAllArtists = async() => {
        console.log("x");
        try {
            const artists = await locals.pb.collection('artist').getList(1,50,{
                sort: '-created'
            });
            return artists;
        } catch (err: any) {
            console.log(err);
            //throw error(err.status, err.message)
        }
    }
    return {
        artists: getAllArtists()
    }
}