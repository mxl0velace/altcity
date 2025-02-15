import { error, redirect } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    if (!locals.user){
        redirect(303,"/login");
    }
    const getUserWithCollection = async() => {
        try {
            const userArts = await locals.pb.collection('users').getOne(locals?.user?.id || "", {
                expand: "cardcollection_via_owner.cards.artist"
            })
            return userArts;
        } catch (err: any) {
            console.log(err);
            //throw error(err.status, err.message)
        }
    }
    return {
        fulluser: await getUserWithCollection(),
        title: "Alt Arts"
    }
}