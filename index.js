"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@xmpp/client");
const product_1 = require("./scripts/product");
const xmpp = (0, client_1.client)({
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
});
xmpp.on('online', async (address) => {
    console.log("online as", address.toString());
    // Makes itself available
    await xmpp.send((0, client_1.xml)("presence", { to: 'nwws@conference.nwws-oi.weather.gov/nwws' }));
});
xmpp.on('stanza', async (stanza) => {
    if (stanza.is("message")) {
        const x = stanza.getChild('x');
        if (x != undefined) {
            (0, product_1.processProduct)(x.children.toString());
        }
    }
});
xmpp.start().catch(console.error);
