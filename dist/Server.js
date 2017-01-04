"use strict";
const events_1 = require("events");
const ws_1 = require("ws");
// import { Handler } from "./Handler";
const uid = require("shortid");
class Server extends events_1.EventEmitter {
    constructor(options) {
        super();
        // protected handler: Handler = new Handler();
        this.clients = {};
        this.onConnect = (client) => {
            let clientID = uid.generate();
            client.id = clientID;
            client.on('message', this.onMessage.bind(this, client));
            client.on('error', this.onError.bind(this, client));
            client.on('close', this.onDisconnect.bind(this, client));
            this.clients[clientID] = [];
            this.emit('connect', client);
            client.send(`request accepted from clientID ${clientID}`);
        };
        this.server = new ws_1.Server(options);
        this.server.on('connection', this.onConnect);
    }
    onError(client, e) {
        console.error("[ERROR]", client.id, e);
    }
    onMessage(client, data) {
        let msg = data;
        console.log(msg);
        this.emit('message', client, msg);
    }
    onDisconnect(client) {
        this.emit('disconnect', client);
    }
}
exports.Server = Server;
