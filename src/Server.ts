import { EventEmitter } from "events";
import { Server as WebSocketServer } from "ws";
import { Room } from "./Room";
import { Client } from "./index";
import { Handler } from "./Handler";
import { Sign } from './Sign';
import * as uid from 'shortid';
import * as msgpack from "msgpack-lite";
import * as _ from 'underscore';

export class Server extends EventEmitter{
	protected server: WebSocketServer;
	protected handler: Handler = new Handler();
	protected clients:{[id:string]:Room<any>[]} = {};

	protected msgOption:{} = {binary:true};

	constructor(options){
		super();
		this.server = new WebSocketServer(options);	
		this.server.on('connection',this.onConnect);
	}

	public getRoomList(): any{
		return this.filterRoomProperty(this.handler.getRoomList());
	}

	private filterRoomProperty(rooms: any): any{
		let tmpData = {};
		for(var roomID in rooms){
			tmpData[roomID] = {};
			tmpData[roomID] = _.pick(rooms[roomID],['roomName','status','options']);
			tmpData[roomID].status = Sign[rooms[roomID].status];
			tmpData[roomID].roomToken = rooms[roomID].options.roomToken;
			delete tmpData[roomID].options;
		}
		return tmpData;
	}

	public getRoomInfo(roomID:number): Room<any>{
		return this.handler.getRoomByID(roomID);
	}

	private onConnect = (client:Client) => {
		let clientID = uid.generate();
		client.id = clientID;
		client.data = {};
		client.on('message', this.onMessage.bind(this,client));
		client.on('error', this.onError.bind(this, client));
		client.on('close', this.onDisconnect.bind(this, client));
		
		this.clients[clientID] = [];
		client.send(msgpack.encode([Sign.CLIENT_ID,clientID,`Client obtain ID ${clientID}`]),this.msgOption);
		this.emit('connect',client);
	}

	public createRoom(roomName: string,options?:any) : Room<any>{
		var room: Room<any>;
		room = this.handler.create(roomName,options);
		if(room){
			room.once('leave',this.onClientLeaveRoom.bind(this,room));
		}else{
			throw new Error('Create room failed');
		}
		console.info(`Room ${room.roomName}[${room.roomID}] created`);
		return _.pick(room,['roomID','roomName','status','options']);
	}

	public deleteRoom(roomID:number,callback?:Function){
		// TODO : check status before delete then remove all of client in room
		console.info(`Room [${roomID}] deleted`);
		this.handler.delete(roomID);
	}

	public startRoom(roomID:number,callback:(err:any,pass:boolean)=>any = ()=>{}){
		this.handler.startRoom(roomID,callback);
	}

	public stopRoom(roomID:number,callback:(err:any,pass:boolean)=>any = ()=>{}){
		this.handler.stopRoom(roomID,callback);
	}

	public pauseRoom(roomID:number,callback:(err:any,pass:boolean)=>any = ()=>{}){
		this.handler.pauseRoom(roomID,callback);
	}

	public resumeRoom(roomID:number,callback:(err:any,pass:boolean)=>any = ()=>{}){
		this.handler.resumeRoom(roomID,callback);
	}



	private onError (client: Client, e: any) {
		console.error("[ERROR]", client.id, e)
	}

	private onMessage(client:Client, message:any){
		let data;
		try {
			data = msgpack.decode(message);
		} catch (e) {
			console.error("Couldn't decode message:", message, e.stack);
			return;
		}
		try{
			switch (data[0]) {
				case Sign.CLIENT_NAME:
					client.data.name = data[1];
					console.info(`Client ${client.data.name} connected`);
					break;
				case Sign.CLIENT_TOKEN:
					if(uid.isValid(data[1])){
						client.data.token = data[1];
					}
					else{
						console.info(`Kick client ${client.name || "anonymous"} because of no token`)
						client.close();
					}
					break;
				case Sign.CLIENT_JOIN:
					try{
						let room = this.onJoinRoomRequest(client,data[1]);
					}catch(e){
						client.send(msgpack.encode([Sign.CLIENT_ERR,e.message,`Join room error`]),this.msgOption);
					}
					break;
				case Sign.CLIENT_LEAVE:
					this.onClientLeaveRoom(this.clients[client.id][0],client,false);
					break;
				default:
					try{
						console.log(data[2]);
					}catch(e){ }
					break;
			}
		}catch(e){
			console.error('Error occured', e.message)
		}
		this.emit('message', client, data);
	}

	private onJoinRoomRequest(client:Client, roomID:number): Room<any>{
		let room: Room<any>;
		if(this.handler.hasRoom(roomID)){
			room = this.handler.joinByID(client,roomID);
			if(room){
				room.once('leave',this.onClientLeaveRoom.bind(this,room));
				this.clients[client.id].push(room);
			}else{
				throw new Error('Join request Failed');
			}
			console.info(`Client ${client.data.name} join to room ${room.roomName}[${room.roomID}]`)
			return room;
		}else{
			throw new Error('room not found');
		}
	}

	private onClientLeaveRoom(room: Room<any>,client:Client, isDisconnect:boolean): boolean{
		if(isDisconnect){
			return true;
		}
		var roomIDX = this.clients[client.id].indexOf(room);
		if(roomIDX >= 0){
			this.clients[client.id].splice(roomIDX,1);
			(<any>room)._onLeave(client,isDisconnect);
			console.info(`Client ${client.data.name} leaving room ${room.roomName}[${room.roomID}]`)
		}
	}

	private onDisconnect (client:Client) {
		console.info(`Client ${client.data.name} disconnected`);
		this.emit('disconnect', client);
		this.handler.clientLeave(client);
		delete this.clients[client.id];
	}

}