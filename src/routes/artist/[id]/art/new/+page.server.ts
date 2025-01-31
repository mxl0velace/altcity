import { isRedirect, redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({request, locals, params}) => {
        const data = await request.formData();

        data.append("artist", params.id)

        try {
            var result = await locals.pb.collection('art').create(data);
            redirect(303, "/alt/"+result.id);
        } catch (error) {
            if (isRedirect(error)){
                throw error;
            }
            console.log(error);
        }
    }
}

export const load = async ({locals, params}) => {
    const getArtist = async(artistId: any) => {
        try {
            const artist = await locals.pb.collection('artist').getOne(artistId);
            return artist;
        } catch (err: any) {
            console.log(err);
            //throw error(err.status, err.message)
        }
    }
    return {
        artist: getArtist(params.id)
    }
}