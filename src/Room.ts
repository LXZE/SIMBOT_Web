import { EventEmitter } from "events";
import { Client } from "./index";
import * as msgpack from "msgpack-lite";
import { Sign } from "./Sign";

export class Room<T> extends EventEmitter{
	public roomID: number;
	public roomName: string;

	protected clients: Client[] = [];
	public options: any;

	public state: T;
	protected prevState: any;

	public maxPlayer: number;
	protected lock: boolean;

	private msgOption:{} = {binary:true};

	constructor(options: any = {}){
		super();

		this.roomID = options.roomID;
		this.roomName = options.roomName;
		this.maxPlayer = options.maxPlayer;

		this.options = options;
		this.lock = false;

	}

	public requestJoin(): boolean{
		return !this.lock;
	}

	public setState(newState){
		this.prevState = this.state;
		this.state = newState;
	}

	public startRoom(){
		if(this.lock){
			this.runSimulation();
		}
	}

	public stopRoom(){
		this.stopSimulation();
	}

	private runSimulation(){
		// TODO : RUN simulation in each iteration
	}

	private stopSimulation(){
		// TODO : Stop simulation
	}


	public lockRoom():void{
		this.emit('lock');
		this.lock = true;
	}

	public unlockRoom(): void{
		this.emit('unlock');
		this.lock = false;
	}

	public send(client:Client, data:any): void{
		let msg = msgpack.encode([Sign.ROOM_DATA,data]);
		client.send(msg,this.msgOption);
	}

	private sendState(client:Client): void{

	}

	public broadcast(data:any){
		data = msgpack.encode([Sign.ROOM_DATA])
		this.clients.forEach(client => client.send(data,this.msgOption));
	}

	public onMessage(client:Client, data:any): void{
		// this.state.message.push(data);
		console.log(`At ${this.roomName}: ${client.id} -> ${data}`);
	}

	public onJoin(client:Client, options:any): void{
		// send waiting for action to client
		let msg = msgpack.encode([Sign.CLIENT_WAIT,0,`Wait until room ${this.roomID} start`]);
		client.send(msg,this.msgOption);
	}

	public onLeave(client:Client): void{
		// do noting

	}

	public onDispose(){
		console.log('Dispose room');
	}

	private _onJoin(client:Client, options?:any): void{
		this.clients.push(client);
		// if(this.state){
		// 	this.sendState(client);
		// }
		if(this.onJoin){
			this.onJoin(client,options);
		}
	}
	private _onLeave (client: Client, isDisconnect: boolean = false): void {
		this.clients.splice(this.clients.indexOf(client),1);
		if (this.onLeave) this.onLeave(client);
		this.emit('leave', client, isDisconnect);

		if (!isDisconnect) {
			client.send(msgpack.encode([Sign.ROOM_LEAVE,this.roomID]),this.msgOption);			
		}
	}

}