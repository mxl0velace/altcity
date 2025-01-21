export const actions = {
    default: async ({request, locals, params}) => {
        const data = await request.formData();

        data.append("artist", params.id)

        try {
            await locals.pb.collection('art').create(data);
        } catch (error) {
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