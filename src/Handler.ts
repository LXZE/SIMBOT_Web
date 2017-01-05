import { Room } from './Room';
import { Client } from './index';
import * as uid from 'shortid';

export class Handler{

	private roomList: {[id:string]: Room<any>} = {};
	private roomCount: number = 0;

	public hasRoom(roomID: number): boolean {
		return this.roomList[ roomID ] ? true : false;
	}

	public startRoom(roomID: number){
		this.roomList[roomID].startRoom();
	}

	public stopRoom(roomID: number){
		this.roomList[roomID].stopRoom();
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
		if(!room.requestJoin()){ throw new Error(`Room locked`); }
		if(room){
			if(client.data.token == room.options.roomToken){
				(<any>room)._onJoin(client);
			}else{
				throw new Error(`Room token invalid`);
			}
		}
		return room;
	}

	public create(roomName:string,options?:any): Room<any> {
		let room = null;
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
		}else{
			room = null;
		}
		return room;
	}

	public delete(roomID:number): void{
		this.disposeRoom(roomID,this.roomList[roomID]);
	}

	private lockRoom(roomID:number, room:Room<any>): void{
		room.lockRoom();
	}

	private unlockRoom(roomID:number, room:Room<any>): void{
		room.unlockRoom();
	}
	private disposeRoom(roomID: number, room: Room<any>): void {
		delete this.roomList[roomID];
		room.lockRoom();
	}
}