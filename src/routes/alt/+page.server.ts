import { error } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    const getAllArts = async() => {
        try {
            const arts = await locals.pb.collection('art').getList(1,50,{
                sort: '-created',
                expand: 'artist, cardcollection_via_cards'
            });
            return arts;
        } catch (err: any) {
            //throw error(err.status, err.message)
        }
    }
    var userWithCollections;
    try {
        userWithCollections = await locals.pb.collection('users').getOne(locals.user.id, {
            expand: "cardcollection_via_owner.cards"
        })
    } catch (err) {
        console.log(err)
    }
    return {
        arts: getAllArts(),
        title: "Alt Arts",
        userWithCollections: userWithCollections
    }
}