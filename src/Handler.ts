import { Room } from './Room';
import { Client } from './index';
import * as uid from 'shortid';

export class Handler{

	// private handler: {[id:string]: any[]} = {};
	private roomList: {[id:string]: Room<any>} = {};
	// private roomList: {[id:string]: Room<any>[]} = {};
	// private roomByID: {[name:number]: Room<any>} = {};
	private roomCount: number = 0;

	// public addHandler(name:string, options: any={}){
	// 	this.handler[name] = [options];
	// 	this.roomList[name] = [];
	// }

	// public hasRoom(roomName: string): boolean {
	// 	return this.roomList[ roomName ] ? true : false;
	// }
	public hasRoom(roomID: number): boolean {
		return this.roomList[ roomID ] ? true : false;
	}

	public getRoomByID(roomID: number): Room<any>{
		return this.roomList[roomID];
	}

	public getRoomList():{}{
		return this.roomList;
	}

	public joinByID(client:Client, roomID:number): Room<any> {
		let room = this.roomList[ roomID ];
		if(!room) { throw new Error(`room doesn't exit`); }
		if(!room.requestJoin()){ throw new Error(`Can't join room`); }
		(<any>room)._onJoin(client);
		return room;
	}

	// public joinByName(client:Client, roomName:string): Room<any> {
	// 	let room = this.requestJoin(client,roomName);
	// 	if(room) (<any>room)._onJoin(client);
	// 	return room;
	// }

	public requestJoin(client:Client, roomID:number): Room<any>{
		let room: Room<any>;
		if(this.hasRoom(roomID)){
			let availRoom = this.roomList[roomID];
			if(availRoom.requestJoin()){
				room = availRoom;
			}
			//  for ( var i=0; i < this.roomList[ roomName ].length; i++ ) {
			// 	let availableRoom = this.roomList[ roomName ][ i ];
			// 	if ( availableRoom.requestJoin() ) {
			// 		room = availableRoom;
			// 		break;
			// 	}
			// }
		}
		return room;
	}

	public create(roomName:string,options?:any): Room<any> {
	// public create(client:Client, roomName:string): Room<any> {
		let room = null;
		// let handler = this.handler[ roomName ][0];
		// let options = this.handler[ roomName ][1];
		let roomOptions = options;

		roomOptions.roomID = this.roomCount++;
		roomOptions.roomName = roomName;
		roomOptions.roomToken = uid.generate();

		room = new Room(roomOptions);
		this.roomList[roomOptions.roomID] = room;
		if(room.requestJoin()){
			room.on('lock', this.lockRoom.bind(this, roomName, room));
			room.on('unlock', this.unlockRoom.bind(this, roomName, room));
			room.once('dispose', this.disposeRoom.bind(this, roomName, room));

			// this.roomByID[ room.roomID ] = room;
			// this.unlockRoom(roomID, room);
		}else{
			room = null;
		}
		return room;
	}

	private lockRoom(roomID:number, room:Room<any>): void{
		room.lockRoom();
		// if(this.hasRoom(roomName)){
		// 	let idx = this.roomList[roomID].indexOf(room);
		// 	if(idx != -1){
		// 		this.roomList[roomName].splice(idx,1);
		// 	}
		// }
	}

	private unlockRoom(roomID:number, room:Room<any>): void{
		room.unlockRoom();
		// if(this.roomList[roomName].indexOf(room) === -1){
		// 	this.roomList[roomName].push(room);
		// }
	}
	private disposeRoom(roomID: number, room: Room<any>): void {
		delete this.roomList[roomID];
		room.lockRoom();
		// delete this.roomByID[ room.roomID ];
		// this.lockRoom(roomName, room)
	}
}