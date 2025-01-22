import { redirect, isRedirect } from '@sveltejs/kit';

export const actions = {
    default: async ({request, locals}) => {
        const data = await request.formData();

        try {
            let result = await locals.pb.collection('users').authWithPassword(data.get("email"), data.get("password"));
            if(!locals.pb.authStore.isValid){
                locals.pb.authStore.clear();
            }
            redirect(303, "/");
        } catch (error) {
            if (isRedirect(error)){
                throw error;
            }
            console.log(error);
        }
    }
}
