import { Room } from './Room';
import { Client } from './index';
import { Sign } from './Sign';
import * as uid from 'shortid';

export class Handler{

	private roomList: {[id:string]: Room<any>} = {};
	private roomCount: number = 0;

	public hasRoom(roomID: number): boolean {
		return this.roomList[ roomID ] ? true : false;
	}

	public startRoom(roomID: number,callback: (err:any,pass:boolean)=>any){
		let room = this.roomList[roomID];
		if(!room){
			callback('room not found',false);
		}
		if(!room.getCurrentLock() && room.getCurrentStatus() == Sign.ROOM_STOP){
			room.lockRoom();
			room.start();
			callback(null,true);
		}else{
			callback('room already started',false);
		}
	}

	public stopRoom(roomID: number,callback: (err:any,pass:boolean)=>any){
		let room = this.roomList[roomID];
		if(!room){
			callback('room not found',false);
		}
		if(room.getCurrentLock() && room.getCurrentStatus() !== Sign.ROOM_STOP){
			room.stop();
			room.unlockRoom();
			callback(null,true);
		}else{
			callback('room already stop',false);
		}
	}

	public pauseRoom(roomID:number,callback: (err:any,pass:boolean)=>any){
		let room = this.roomList[roomID];
		if(!room){
			callback('room not found',false);
		}
		if(room.getCurrentLock() && room.getCurrentStatus() !== Sign.ROOM_PAUSE){
			room.pause();
			callback(null,true);
		}else{
			callback('room is paused',false);
		}
	}

	public resumeRoom(roomID:number, callback: (err:any,pass:boolean)=>any){
		let room = this.roomList[roomID];
		if(!room){
			callback('room not found',false);
		}
		if(room.getCurrentLock() && room.getCurrentStatus() !== Sign.ROOM_RUN){
			room.resume();
			callback(null,true);
		}else{
			callback('room is running',false);
		}
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
	public clientLeave(client:Client){
		console.log(`${client.data.name}[${client.id}] removed from server`)
		Object.keys(this.roomList).forEach((roomKeys)=>{
			let room = this.roomList[roomKeys];
			room.onLeave(client);
		})
	}

	public create(roomName:string,options?:any): Room<any> {
		let room = null;
		let roomOptions = options;

		roomOptions.roomID = this.roomCount++;
		roomOptions.roomName = roomName;
		roomOptions.roomToken = uid.generate();
		roomOptions.movementType = options.movementType || Sign.CONTINUE_MOTION;

		room = new Room(roomOptions);
		this.roomList[roomOptions.roomID] = room;
		return room;
	}

	public delete(roomID:number,callback: (err:any,pass:boolean)=>any = ()=>{}): void{
		this.disposeRoom(roomID,this.roomList[roomID]);
	}

	private disposeRoom(roomID: number, room: Room<any>): void {
		delete this.roomList[roomID];
		room.lockRoom();
	}
}