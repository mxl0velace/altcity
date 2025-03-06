import { error, isRedirect, redirect } from '@sveltejs/kit';

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

export const actions = {
    default: async ({request, locals, params}) => {
        const data = await request.formData();
        try {
            var toSend = {
                name: data.get("name"),
                link: data.get("link"),
            }
            if (data.get("logo")){
                if (!data.get("logo").size == 0) {
                    toSend.logo = data.get("logo");
                }
            }    
            let result = await locals.pb.collection('artist').update(params.id, toSend);
            redirect(303, "/artist/"+result.id);
        } catch (error) {
            if (isRedirect(error)){
                throw error;
            }
            console.log(error);
        }
    }
}