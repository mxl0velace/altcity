import { sanitizeString } from "$lib/utils.js";
import { isRedirect, redirect } from "@sveltejs/kit";
import sharp from "sharp";

export const actions = {
    default: async ({request, locals, params}) => {
        const data = await request.formData();
        data.set("cardname", sanitizeString(data.get("cardname") || "", false));
        if (data.get("watermark") && data.get("image")?.size > 0) {
            const img = data.get("image");
            //@ts-ignore
            const simg = sharp(await img.arrayBuffer());
            const meta = await simg.metadata();
            const svgWatermark = `
                <svg width="${meta.width}" height="${meta.height}">
                    <style>
                        .title { fill: #001; font-size: ${(meta?.width || 500)/6}px; font-weight: bold; opacity: 13%;}
                    </style>
                    <text x="50%" y="50%" text-anchor="middle" class="title">alt city grid</text>
                    <text x="50%" y="25%" text-anchor="middle" class="title">alt city grid</text>
                    <text x="50%" y="75%" text-anchor="middle" class="title">alt city grid</text>
                </svg>        `;
            //@ts-ignore
            const svgBuffer = Buffer.from(svgWatermark);
            const watermarkedImage = await simg.composite([{
                input: svgBuffer,
                top: 0,
                left: 0,
            }]).toBuffer();
            data.set("image", new Blob([watermarkedImage]));
        }
        try {
            var card = await locals.pb.collection('card').getFirstListItem(`name = '${sanitizeString(data.get("cardname"))}'`);
            data.set("cardlink", card.id);
        } catch (err) {
            
        }

        try {
            var result = await locals.pb.collection('art').create(data);
            redirect(303, "/alt/"+result.id);
        } catch (error) {
            if (isRedirect(error)){
                throw error;
            }
            //console.log(error);
            return {
                status: "error_unknown"
            }
        }
    }
}

export const load = async ({locals, params}) => {
    const getAllArtists = async() => {
        try {
            const artist = await locals.pb.collection('artist').getFullList();
            return artist;
        } catch (err: any) {
            console.log(err);
            //throw error(err.status, err.message)
        }
    }
    return {
        artists: await getAllArtists()
    }
}