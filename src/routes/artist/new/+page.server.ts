import { isRedirect, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({request, locals}) => {
        const data = await request.formData();
        try {
            var toSend = {
                name: data.get("name"),
                link: data.get("link"),
                logo: ""
            }
            if (data.get("logo")){
                if (!data.get("logo").size == 0) {
                    toSend.logo = data.get("logo");
                }
            }    
            let result = await locals.pb.collection('artist').create(toSend);
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