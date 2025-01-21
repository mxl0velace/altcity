import { error } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    const getAllArts = async() => {
        try {
            const arts = await locals.pb.collection('art').getList(1,50,{
                sort: '-created',
                expand: 'artist'
            });
            return arts;
        } catch (err: any) {
            console.log(err);
            //throw error(err.status, err.message)
        }
    }
    return {
        arts: getAllArts()
    }
}