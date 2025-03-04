import { getImageURL } from '$lib/utils.js';
import { error, isRedirect, redirect } from '@sveltejs/kit';
import { sanitizeString } from '$lib/utils.js';
import sharp from "sharp";

export const load = async ({locals, params}) => {
    if (!locals.user) {
        error(401);
    }
    try {
        let art = await locals.pb.collection('art').getOne(params.id, {expand: "artist"});
        if (!(locals.user.role == "admin" || locals.user.id == art.expand.artist.user)) {
            error(403);
        }
        return {
            art: art
        }
    } catch (error) {
        console.log(error);
    }
    return {
        art: null
    }

}

export const actions = {
    default: async ({request, locals, params}) => {
        if (!locals.user) {
            error(401);
        }
        try {
            let art = await locals.pb.collection('art').getOne(params.id, {expand: "artist"});
            if (!(locals.user.role == "admin" || locals.user.id == art.expand.artist.user)) {
                error(403);
            }    
        } catch (err) {
            console.log(error);
            error(403);
        }
        const data = await request.formData();
        data.set("cardname", sanitizeString(data.get("cardname") || "", false));
        if ((data.get("watermark") || data.get("resize") || data.get("bleed") || data.get("rounded")) && data.get("image")?.size > 0) {
            const img = data.get("image");
            //@ts-ignore
            var simg = sharp(await img.arrayBuffer());
            var meta = await simg.metadata();

            if (data.get("bleed")) {
                if(meta.height > meta.width) { // Portrait
                    simg = simg.extract({
                        left: ((816-744)/2)*meta.width/816, // Calculated from MPC template values
                        top: ((1110-1038)/2)*meta.height/1110, 
                        width: 744*meta.width/816, 
                        height: 1038*meta.height/1110
                    })
                    meta.width = 744*meta.width/816;
                    meta.height = 1038*meta.height/1110;
                } else {
                    simg = simg.extract({
                        top: ((816-744)/2)*meta.height/816,
                        left: ((1110-1038)/2)*meta.width/1110, 
                        height: 744*meta.height/816, 
                        width: 1038*meta.width/1110
                    })
                    meta.height = 744*meta.height/816;
                    meta.width = 1038*meta.width/1110;
                }
            }

            if (data.get("resize")) {
                if(meta.height > meta.width) { // Portrait
                    simg = simg.resize({height: 418, width: 300})
                    meta.height = 418;
                    meta.width = 300;
                } else {
                    simg = simg.resize({height: 300, width: 418})
                    meta.height = 300;
                    meta.width = 418;
                }
            }
            const svgWatermark = `
            <svg width="${meta.width}" height="${meta.height}">
                <style>
                    .title { fill: #001; font-size: ${(meta?.width || 500)/6}px; font-weight: bold; opacity: 13%;}
                </style>
                <text x="50%" y="50%" text-anchor="middle" class="title">alt city grid</text>
                <text x="50%" y="25%" text-anchor="middle" class="title">alt city grid</text>
                <text x="50%" y="75%" text-anchor="middle" class="title">alt city grid</text>
            </svg>        `;

            if (data.get("watermark")){
                //@ts-ignore
                const svgBuffer = Buffer.from(svgWatermark);
                //@ts-ignore
                simg = simg.composite([{
                    input: svgBuffer,
                    top: 0,
                    left: 0,
                }])
            }

            var corners;
            if(meta.height > meta.width) { // Portrait
                corners = `<svg><rect x="0" y="0" width="${meta.width}" height="${meta.height}" rx="${Math.floor(33*meta.width/744)}"/></svg>`;
            } else {
                corners = `<svg><rect x="0" y="0" width="${meta.width}" height="${meta.height}" rx="${Math.floor(33*meta.height/744)}"/></svg>`;
            }


            if (data.get("rounded")){
                //@ts-ignore
                const svgBuffer = Buffer.from(corners);
                //@ts-ignore
                simg = simg.composite([{
                    input: svgBuffer,
                    top: 0,
                    left: 0,
                    blend: "dest-in"
                }])
            }

            data.set("image", new Blob([await simg.toBuffer()]));
        
        }
        if (data.get("image")?.size == 0) {
            data.delete("image");
        }
        try {
            var card = await locals.pb.collection('card').getFirstListItem(`name = '${sanitizeString(data.get("cardname"))}'`);
            data.set("cardlink", card.id);
        } catch (err) {
            
        }

        try {
            var result = await locals.pb.collection('art').update(params.id, data);
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