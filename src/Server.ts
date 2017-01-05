import { EventEmitter } from "events";
import { Server as WebSocketServer } from "ws";
import { Room } from "./Room";
import { Client } from "./index";
import { Handler } from "./Handler";
import { Sign } from './Sign';
import * as uid from 'shortid';
import * as msgpack from "msgpack-lite";

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

	public getRoomList(): {}{
		return this.handler.getRoomList();
	}

	private onConnect = (client:Client) => {
		let clientID = uid.generate();
		client.id = clientID;
		client.on('message', this.onMessage.bind(this,client));
		client.on('error', this.onError.bind(this, client));
		client.on('close', this.onDisconnect.bind(this, client));
		
		this.clients[clientID] = [];
		this.emit('connect',client);
	}

	public createRoom(roomName: string,options?:any) : Room<any>{
		var room: Room<any>;
		// if(typeof(roomToCreate))
		room = this.handler.create(roomName,options);
		if(room){
			room.once('leave',this.onClientLeaveRoom.bind(this,room));
			// this.clients[client.id]
		}else{
			throw new Error('Create room failed');
		}
		return room;
	}

	// public register (name:string,options?:any){
	// 	this.handler.addHandler(name,options);
	// }

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
		switch (data[0]) {
			case 2:
				client.name = data[1];
				break;
			case 3:
				if(uid.isValid(data[1]))
					client.token = data[1];
				else{
					console.log(`Kick client ${client.name || "anonymous"} because no token`)
					client.close();
				}
				break
			default:
				try{
					console.log(data[2]);
				}catch(e){ }
				break;
		}
		this.emit('message', client, data);
	}

	private onJoinRoomRequest(client:Client, roomID:number): Room<any>{
		let room: Room<any>;
		room = this.handler.joinByID(client,roomID);
		if(room){
			room.once('leave',this.onClientLeaveRoom.bind(this,room));
			this.clients[client.id].push(room);
		}else{
			throw new Error('Join request Failed');
		}
		return room;
	}

	private onClientLeaveRoom(room: Room<any>,client:Client, isDisconnect:boolean): boolean{
		if(isDisconnect){
			return true;
		}
		var roomIDX = this.clients[client.id].indexOf(room);
		if(roomIDX >= 0){
			this.clients[client.id].splice(roomIDX,1);
		}
	}

	private onDisconnect (client:Client) {
		this.emit('disconnect', client);
		delete this.clients[client.id];
		console.log(`Client ${client.name} disconnected`);
	}

}