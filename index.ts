import { client, xml } from '@xmpp/client';
import { processProduct } from './scripts/product';
import * as dotenv from 'dotenv'
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
        await xmpp.send(xml("presence", {to: `nwws@conference.nwws-oi.weather.gov/${process.env.NWWS_USER}`}, xml("x", {})))
        console.log("online as", address.toString());
})

xmpp.on('stanza', async (stanza) => {
    if (stanza.is("message")) {
	    const x = stanza.getChild('x')
        if (x != undefined) {
            processProduct(x.children.toString())
        }
    }
});

xmpp.start().catch(console.error);
