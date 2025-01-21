import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_POCKETBASE_LOCATION } from '$env/static/public'


export const handle: Handle = async ({ event, resolve }) => {
    const pb = new PocketBase(PUBLIC_POCKETBASE_LOCATION);

    event.locals.pb = pb;
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
    const model = event.locals.pb.authStore.record;

    try {
        if (event.locals.pb.authStore.isValid){
            await event.locals.pb.collection('users').authRefresh();
            event.locals.user = structuredClone(model);
        }
    } catch {
        event.locals.pb.authStore.clear();
        event.locals.user = null;
    }

    const response = await resolve(event);
    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({
        secure: false }));

    return response;
};