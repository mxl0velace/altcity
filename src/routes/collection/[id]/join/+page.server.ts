import { error, redirect } from '@sveltejs/kit';

export const load = async ({locals, params}) => {
    if (!locals.user){
        redirect(303,"/login");
    }
    var results;
    try {
        results = await locals.pb.collection('cardcollection').getOne(params.id, {
            expand: "owner"
        });
    } catch (err: any) {
        console.log(err);
        //throw error(err.status, err.message)
    }

    return {
        col: results
    }
}

export const actions = {
    default: async ({request, locals, params}) => {
        if (!locals.user){
            redirect(303,"/login");
        }    
        var toast = 'success_collection';
        try {
            var coll = await locals.pb.collection('cardcollection').getOne(params.id);
            if (!coll.addEditors) {
                toast = "error_collection_closed"
            } else if (coll.editors.includes(locals.user.id) || coll.owner == locals.user.id){
                toast = "error_collection_duplicate"
            } else {
                await locals.pb.collection('cardcollection').update(params.id, {
                    "editors+": locals.user.id
                })
            }
        } catch (err: any) {
            console.log(err);
            //throw error(err.status, err.message)
            toast = "error_unknown"
        }
        redirect(303, `/collection?status=${toast}`);
    }
}