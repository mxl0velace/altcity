import { isRedirect, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({request, locals}) => {
        const data = await request.formData();

        try {
            let result = await locals.pb.collection('artist').create(data);
            console.log(result);
            redirect(303, "/artist/"+result.id);
        } catch (error) {
            if (isRedirect(error)){
                throw error;
            }
            console.log(error);
        }
    }
}