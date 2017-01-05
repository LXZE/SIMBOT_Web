"use strict";
const events_1 = require("events");
const ws_1 = require("ws");
const Handler_1 = require("./Handler");
const uid = require("shortid");
const msgpack = require("msgpack-lite");
class Server extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.handler = new Handler_1.Handler();
        this.clients = {};
        this.msgOption = { binary: true };
        this.onConnect = (client) => {
            let clientID = uid.generate();
            client.id = clientID;
            client.on('message', this.onMessage.bind(this, client));
            client.on('error', this.onError.bind(this, client));
            client.on('close', this.onDisconnect.bind(this, client));
            this.clients[clientID] = [];
            this.emit('connect', client);
        };
        this.server = new ws_1.Server(options);
        this.server.on('connection', this.onConnect);
    }
    getRoomList() {
        return this.handler.getRoomList();
    }
    createRoom(roomName, options) {
        var room;
        // if(typeof(roomToCreate))
        room = this.handler.create(roomName, options);
        if (room) {
            room.once('leave', this.onClientLeaveRoom.bind(this, room));
        }
        else {
            throw new Error('Create room failed');
        }
        return room;
    }
    // public register (name:string,options?:any){
    // 	this.handler.addHandler(name,options);
    // }
    onError(client, e) {
        console.error("[ERROR]", client.id, e);
    }
    onMessage(client, message) {
        let data;
        try {
            data = msgpack.decode(message);
        }
        catch (e) {
            console.error("Couldn't decode message:", message, e.stack);
            return;
        }
        switch (data[0]) {
            case 2:
                client.name = data[1];
                break;
            case 3:
                if (uid.isValid(data[1]))
                    client.token = data[1];
                else {
                    console.log(`Kick client ${client.name || "anonymous"} because no token`);
                    client.close();
                }
                break;
            default:
                try {
                    console.log(data[2]);
                }
                catch (e) { }
                break;
        }
        this.emit('message', client, data);
    }
    onClientLeaveRoom(room, client, isDisconnect) {
        if (isDisconnect) {
            return true;
        }
        var roomIDX = this.clients[client.id].indexOf(room);
        if (roomIDX >= 0) {
            this.clients[client.id].splice(roomIDX, 1);
        }
    }
    onDisconnect(client) {
        this.emit('disconnect', client);
        delete this.clients[client.id];
        console.log(`Client ${client.name} disconnected`);
    }
}
exports.Server = Server;
