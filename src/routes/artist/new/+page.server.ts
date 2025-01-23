import { isRedirect, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({request, locals}) => {
        const data = await request.formData();
        if (data.get("logo")){
            if (data.get("logo").type.includes("txt")) {
                data.delete("logo");
            }
        }
        try {
            let result = await locals.pb.collection('artist').create(data);
            redirect(303, "/artist/"+result.id);
        } catch (error) {
            if (isRedirect(error)){
                throw error;
            }
            console.log(error);
        }
    }
}

export const load = async () => {
    return {
        title: "New Artist"
    }
}