import { client, xml } from '@xmpp/client';
import * as dotenv from 'dotenv'
import surreal, { initDB } from './db/surreal';
import { Processor, Product, ProductObject } from './products/product';
import fs from "fs"
dotenv.config()

const xmpp = client({
    domain: 'nwws-oi.weather.gov',
    service: 'xmpps://nwws-oi.weather.gov',
    username: process.env.NWWS_USER,
    password: process.env.NWWS_PASS,
    resource: "nwws"
}).setMaxListeners(0);

xmpp.on("error", (err) => {
    throw new Error(err.message)
});

xmpp.on('connect', () => {
    console.log('Connected');
})

xmpp.on('online', async (address) => {
    // Makes itself available
    await xmpp.send(xml("presence", { to: `nwws@conference.nwws-oi.weather.gov/${process.env.NWWS_USER}` }, xml("x", {})))
    console.log("Online as", address.toString());
})

xmpp.on('stanza', async (stanza) => {
    if (stanza.is("message")) {
        const x = stanza.getChild('x');
        if (x != undefined) {
            let product: Product;
            try {
                product = await new Processor(x.children.toString());
                console.log(`\nNEW PRODUCT - ${product.id}\n`)
            } catch (e) {
                console.log(e.message)
                return;
            }

            const segments = await surreal.insert('segments', product.segments.map(segment => {
                const obj = segment.toObject;
                return { ...obj, product: `products:${product.id.toString()}` }
            }))

            const seg = segments.map(segment => {
                return segment.id
            })

            if ((await surreal.select(`products:${product.id.toString()}`)).length < 1) {
                await surreal.insert<ProductObject & { segments: string[] }>(`products`, { ...product.toObject, segments: seg });
            } else {
                await surreal.query("UPDATE products SET segments += $seg, updated_at = time::now()", {
                    seg: seg
                })
            }
        }
    }
});

const main = async () => {
    await initDB();

    xmpp.start().catch(console.error);
}

main()
