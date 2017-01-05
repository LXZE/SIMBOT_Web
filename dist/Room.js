"use strict";
const events_1 = require("events");
class Room extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        this.clients = [];
        this.roomID = options.roomID;
        this.roomName = options.roomName;
        this.options = options;
        this.maxPlayer = options.maxPlayer;
        this.lock = false;
    }
    requestJoin() {
        return !this.lock;
    }
    setState(newState) {
        this.prevState = this.state;
        this.state = newState;
    }
    lockRoom() {
        this.emit('lock');
        this.lock = true;
    }
    unlockRoom() {
        this.emit('unlock');
        this.lock = false;
    }
    send(client, data) {
        client.send(data);
    }
    onMessage(client, data) {
        // this.state.message.push(data);
        console.log(`At ${this.roomName}: ${client.id} -> ${data}`);
    }
    onJoin(client, options) {
        // this.state
    }
    onLeave(client) {
        // this.state.message
    }
    onDispose() {
        console.log('Dispose room');
    }
    _onJoin(client, options) {
        this.clients.push(client);
        if (this.state) {
        }
        if (this.onJoin) {
            this.onJoin(client, options);
        }
    }
    _onLeave(client, isDisconnect = false) {
        this.clients.splice(this.clients.indexOf(client), 1);
        if (this.onLeave)
            this.onLeave(client);
        this.emit('leave', client, isDisconnect);
        if (!isDisconnect) {
        }
    }
}
exports.Room = Room;
