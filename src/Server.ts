import { EventEmitter } from "events";
import { Server as WebSocketServer } from "ws";
// import { Room } from "./room";
import { Client } from "./index";
// import { Handler } from "./Handler";
import * as uid from 'shortid';

export class Server extends EventEmitter{
	protected server: WebSocketServer;
	// protected handler: Handler = new Handler();
	protected clients:{} = {};

	constructor(options){
		super();
		this.server = new WebSocketServer(options);	
		this.server.on('connection',this.onConnect);
	}

	private onConnect = (client:Client) => {
		let clientID = uid.generate();
		client.id = clientID;
		client.on('message', this.onMessage.bind(this,client));
		client.on('error', this.onError.bind(this, client));
		client.on('close', this.onDisconnect.bind(this, client));
		

		this.clients[clientID] = [];
		this.emit('connect',client);

		client.send(`request accepted from clientID ${clientID}`);

	}

	private onError (client: Client, e: any) {
		console.error("[ERROR]", client.id, e)
	}

	private onMessage(client:Client, data:any){
		let msg = data;
		console.log(msg);
		this.emit('message', client, msg);
	}

	private onDisconnect (client) {
		this.emit('disconnect', client);
	}

}