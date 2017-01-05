import { EventEmitter } from "events";
import { Client } from "./index";
import * as msgpack from "msgpack-lite";
import { Sign } from "./Sign";

export class Room<Type> extends EventEmitter{
	public roomID: number;
	public roomName: string;

	protected clients: Client[] = [];
	public options: any;

	private state: { [clientID:string]:any[] } = {};
	protected prevState: any;

	protected iteration: NodeJS.Timer;
	protected step:number = 0;
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

	public getClientAmount(): number{
		return this.clients.length;
	}

	public requestJoin(): boolean{
		return !this.lock || this.clients.length < this.maxPlayer;
	}

	public setState(newState){
		this.prevState = this.state;
		this.state = newState;
	}

	public start(){
		if(this.lock){
			console.log(`Room ${this.roomID} start Simulation`);
			console.log(this.options);
			this.clients.forEach(client => {
				this.state[client.id] = [];
				let n = this.options.robotPerPlayer ;
				while(n--){
					this.state[client.id].push({
						owner: client.data.name,
						step: 0,
						x: Math.random()*1024,
						y: Math.random()*768,
						smell: (Math.random()*360)-180,
					})
				}
			});
			this.runSimulation();
		}
	}

	public stop(){
		console.log(`Room ${this.roomID} stop Simulation`);
		this.stopSimulation();
	}

	private runSimulation(){
		// TODO : RUN simulation in each iteration
		if(this.iteration) clearInterval(this.iteration);
		this.iteration = setInterval(()=>{
			this.calculate();
			this.broadcast(this.state);
			this.step++;
			console.log('step = ',this.step);
		},10);
	}

	private calculate(){
		Object.keys(this.state).forEach(clientID=>{
			this.state[clientID].forEach(robot=>{
				robot.step = this.step;
			})
		});
	}

	private stopSimulation(){
		clearInterval(this.iteration);
	}

	public getCurrentLock(): boolean{
		return this.lock;
	}

	public lockRoom():void{
		this.emit('lock');
		this.lock = true;
	}

	public unlockRoom(): void{
		this.emit('unlock');
		this.lock = false;
	}

	// public send(client:Client, data:any): void{
	// 	let msg = msgpack.encode([Sign.ROOM_DATA,data]);
	// 	client.send(msg,this.msgOption);
	// }

	private sendState(client:Client): void{

	}

	public broadcast(data:any){
		let msg;
		this.clients.forEach((client) => {
			msg = msgpack.encode([Sign.ROOM_DATA,data[client.id],'data from server']);
			client.send(msg,this.msgOption)
		});
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
		this.onJoin(client,options);
	}
	private _onLeave (client: Client, isDisconnect: boolean = false): void {
		this.clients.splice(this.clients.indexOf(client),1);
		this.onLeave(client);
		this.emit('leave', client, isDisconnect);
		if (!isDisconnect) {
			client.send(msgpack.encode([Sign.ROOM_LEAVE,this.roomID]),this.msgOption);			
		}
	}

}