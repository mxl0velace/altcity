import { error, redirect } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    if (!locals.user){
        redirect(303,"/login");
    }
    const getUserWithCollection = async() => {
        try {
            const userArts = await locals.pb.collection('users').getOne(locals?.user?.id || "", {
                expand: "cardcollection_via_owner.cards.artist, cardcollection_via_editors.cards.artist"
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

export const actions = {
    default: async ({request, locals}) => {
        const data = await request.formData();
        try {
            var toSend = {
                name: data.get("name"),
                owner: locals?.user?.id
            }
            let result = await locals.pb.collection('cardCollection').create(toSend);
        } catch (error) {
            console.log(error);
        }
    }
}
