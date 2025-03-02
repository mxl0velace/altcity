// @ts-nocheck
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RecordModel } from 'pocketbase';
import { sanitizeString } from '$lib/utils';

export const POST: RequestHandler = async ({locals, params, request}) => {
    let cards: { name: string; quantity: string; alts: { main: number; collection: number; other: number; list: any[];}; }[] = [];

    var req = await request.json();
    for (const element of req.pastedInput.split("\n")){
        let [count, ...texts] = element.split(" ");
        let text = texts.join(" ");
        let text_escaped = sanitizeString(text);
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
            },
            notfound: true
        }
        try {
            let resp = await locals.pb.collection("card").getFirstListItem(`name = '${text_escaped}'`);
            let alts = await locals.pb.collection("art").getFullList({
                filter: `cardname = '${text_escaped}'`,
                expand: "cardcollection_via_cards, artist"
            });
            let mainCollection = locals.user?.main_collection || -1;
            let uid = locals.user?.id || -1;
            let main = 0;
            let collection = 0;
            let other = 0;
            alts.forEach((alt, index) => {
                if (alt.expand?.cardcollection_via_cards?.some((x: { id: any; }) => x.id == mainCollection)) {
                    main += 1;
                    alts[index].inCollection = "main";
                } else if (alt.expand?.cardcollection_via_cards?.some(x => (x.owner == uid || x.editors.includes(uid)))) {
                    collection += 1;
                    alts[index].inCollection = "collection";
                } else {
                    other += 1;
                    alts[index].inCollection = "none";
                }
            });
            alts.sort((a,b) => {
                var order = ["main", "collection", "none"];
                return order.indexOf(a.inCollection) - order.indexOf(b.inCollection);
            })
            toPush = {
                name: text,
                quantity: count,
                alts: {
                    main: main,
                    collection: collection,
                    other: other,
                    list: alts
                },
                notfound: false
            }
        } catch (error) {
            console.log(error);
        }
        cards.push(toPush);
    }
    return json(cards);
};