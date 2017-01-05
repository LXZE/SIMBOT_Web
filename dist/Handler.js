"use strict";
const Room_1 = require("./Room");
const uid = require("shortid");
class Handler {
    constructor() {
        // private handler: {[id:string]: any[]} = {};
        this.roomList = {};
        // private roomList: {[id:string]: Room<any>[]} = {};
        // private roomByID: {[name:number]: Room<any>} = {};
        this.roomCount = 0;
    }
    // public addHandler(name:string, options: any={}){
    // 	this.handler[name] = [options];
    // 	this.roomList[name] = [];
    // }
    // public hasRoom(roomName: string): boolean {
    // 	return this.roomList[ roomName ] ? true : false;
    // }
    hasRoom(roomID) {
        return this.roomList[roomID] ? true : false;
    }
    getRoomByID(roomID) {
        return this.roomList[roomID];
    }
    getRoomList() {
        return this.roomList;
    }
    joinByID(client, roomID) {
        let room = this.roomList[roomID];
        if (!room) {
            throw new Error(`room doesn't exit`);
        }
        if (!room.requestJoin()) {
            throw new Error(`Can't join room`);
        }
        room._onJoin(client);
        return room;
    }
    // public joinByName(client:Client, roomName:string): Room<any> {
    // 	let room = this.requestJoin(client,roomName);
    // 	if(room) (<any>room)._onJoin(client);
    // 	return room;
    // }
    requestJoin(client, roomID) {
        let room;
        if (this.hasRoom(roomID)) {
            let availRoom = this.roomList[roomID];
            if (availRoom.requestJoin()) {
                room = availRoom;
            }
        }
        return room;
    }
    create(roomName, options) {
        // public create(client:Client, roomName:string): Room<any> {
        let room = null;
        // let handler = this.handler[ roomName ][0];
        // let options = this.handler[ roomName ][1];
        let roomOptions = options;
        roomOptions.roomID = this.roomCount++;
        roomOptions.roomName = roomName;
        roomOptions.roomToken = uid.generate();
        room = new Room_1.Room(roomOptions);
        this.roomList[roomOptions.roomID] = room;
        if (room.requestJoin()) {
            room.on('lock', this.lockRoom.bind(this, roomName, room));
            room.on('unlock', this.unlockRoom.bind(this, roomName, room));
            room.once('dispose', this.disposeRoom.bind(this, roomName, room));
        }
        else {
            room = null;
        }
        return room;
    }
    lockRoom(roomID, room) {
        room.lockRoom();
        // if(this.hasRoom(roomName)){
        // 	let idx = this.roomList[roomID].indexOf(room);
        // 	if(idx != -1){
        // 		this.roomList[roomName].splice(idx,1);
        // 	}
        // }
    }
    unlockRoom(roomID, room) {
        room.unlockRoom();
        // if(this.roomList[roomName].indexOf(room) === -1){
        // 	this.roomList[roomName].push(room);
        // }
    }
    disposeRoom(roomID, room) {
        delete this.roomList[roomID];
        room.lockRoom();
        // delete this.roomByID[ room.roomID ];
        // this.lockRoom(roomName, room)
    }
}
exports.Handler = Handler;
