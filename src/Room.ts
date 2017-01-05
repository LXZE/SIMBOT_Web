import { EventEmitter } from "events";
import { Client } from "./index";
import * as msgpack from "msgpack-lite";

export class Room<T> extends EventEmitter{
	public roomID: number;
	public roomName: string;

	protected clients: Client[] = [];
	protected options: any;

	public state: T;
	protected prevState: any;

	public maxPlayer: number;
	protected lock: boolean;

	constructor(options: any = {}){
		super();

		this.roomID = options.roomID;
		this.roomName = options.roomName;
		this.options = options;

		this.maxPlayer = options.maxPlayer;
		this.lock = false;

	}

	public requestJoin(): boolean{
		return !this.lock;
	}

	public setState(newState){
		this.prevState = this.state;
		this.state = newState;
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
		client.send(data);
	}

	public onMessage(client:Client, data:any): void{
		// this.state.message.push(data);
		console.log(`At ${this.roomName}: ${client.id} -> ${data}`);
	}

	public onJoin(client:Client, options:any): void{
		// this.state
	}

	public onLeave(client:Client): void{
		// this.state.message
	}

	public onDispose(){
		console.log('Dispose room');
	}


	private _onJoin(client:Client, options?:any): void{
		this.clients.push(client);

		if(this.state){
			// this.sendState(client);
		}
		if(this.onJoin){
			this.onJoin(client,options);
		}
	}
	private _onLeave (client: Client, isDisconnect: boolean = false): void {
		this.clients.splice(this.clients.indexOf(client),1);
		if (this.onLeave) this.onLeave(client);
		this.emit('leave', client, isDisconnect);

		if (!isDisconnect) {
			// client.send('disconnect');
		}
	}

}