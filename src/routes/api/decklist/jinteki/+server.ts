// @ts-nocheck
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RecordModel } from 'pocketbase';

export const POST: RequestHandler = async ({locals, params, request}) => {
    let cards: { name: string; quantity: string; alts: { main: number; collection: number; other: number; list: any[];}; }[] = [];

    var req = await request.json();
    for (const element of req.pastedInput.split("\n")){
        let [count, ...texts] = element.split(" ");
        let text = texts.join(" ");
        let text_escaped = text.replace("'", "\\'");
        if (isNaN(count)) {
            continue;
        }
        if (text == null || text == "") {
            continue;
        }
        let toPush = {
            name: text,
            quantity: count,
            alts: {
                main: 0,
                collection: 0,
                other: 0,
                list: []
            }
        }
        try {
            let resp = await locals.pb.collection("card").getFirstListItem(`name = '${text_escaped}'`);
            let alts = await locals.pb.collection("art").getFullList({
                filter: `cardname = '${text_escaped}'`,
                expand: "cardcollection_via_cards"
            });
            let mainCollection = locals.user?.main_collection || -1;
            let uid = locals.user?.id || -1;
            let main = 0;
            let collection = 0;
            let other = 0;
            alts.forEach(alt => {
                if (alt.expand?.cardcollection_via_cards?.some((x: { id: any; }) => x.id == mainCollection)) {
                    main += 1;
                } else if (alt.expand?.cardcollection_via_cards?.some(x => (x.owner == uid || x.editors.includes(uid)))) {
                    collection += 1;
                } else {
                    other += 1
                }
            });
            toPush = {
                name: text,
                quantity: count,
                alts: {
                    main: main,
                    collection: collection,
                    other: other,
                    list: alts
                }
            }
        } catch (error) {
            console.log(error);
        }
        cards.push(toPush);
    }
    return json(cards);
};