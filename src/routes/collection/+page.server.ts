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
    new: async ({request, locals}) => {
        const data = await request.formData();
        try {
            var toSend = {
                name: data.get("name"),
                owner: locals?.user?.id,
                addEditors: (data.get("addEditors") == "on" ? true : false) 
            }
            let result = await locals.pb.collection('cardCollection').create(toSend);
        } catch (error) {
            console.log(error);
        }
    },
    settings: async ({request, locals}) => {
        const data = await request.formData();
        try {
            var toSend = {
                name: data.get("name"),
                addEditors: (data.get("addEditors") == "on" ? true : false) 
            }
            let result = await locals.pb.collection('cardCollection').update(data.get("collectionId")?.toString() || "", toSend);
            if (data.get("main")) {
                if (locals.user?.main_collection != data.get("collectionId")) {
                    await locals.pb.collection('users').update(locals.user?.id || "", {
                        main_collection: data.get("collectionId")
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    delete: async ({request, locals}) => {
        const data = await request.formData();
        try {
            let result = await locals.pb.collection('cardCollection').delete(data.get("collectionId")?.toString() || "");
        } catch (error) {
            console.log(error);
        }

    }
}
