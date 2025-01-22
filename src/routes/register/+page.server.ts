import { redirect, isRedirect } from '@sveltejs/kit';

export const actions = {
    default: async ({request, locals}) => {
        const data = await request.formData();

        try {
            let result = await locals.pb.collection('users').create(data);
            redirect(303, "/");
        } catch (error) {
            if (isRedirect(error)){
                throw error;
            }
            console.log(error);
        }
    }
}
