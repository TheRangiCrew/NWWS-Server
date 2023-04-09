import { client, xml } from '@xmpp/client';
import { processProduct } from './scripts/product';

const xmpp = client({
    domain: 'nwws-oi.weather.gov',
    service: 'xmpps://nwws-oi.weather.gov',
    username: 'wind.088',
    password: 'a3qY8m$',
}).setMaxListeners(0);

xmpp.on("error", (err) => {
  console.error(err);
});

xmpp.on('connect', () => {
    console.log('Connected');
})

xmpp.on('online', async (address) => {
    console.log("online as", address.toString());

    // Makes itself available
    await xmpp.send(xml("presence", {to: 'nwws@conference.nwws-oi.weather.gov/nwws'}))
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