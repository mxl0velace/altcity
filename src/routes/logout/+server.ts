import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({locals}) => {
    locals.pb.authStore.clear();
    locals.user = null;
    redirect(303, "/");
};