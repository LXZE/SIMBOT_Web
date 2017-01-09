import { EventEmitter } from "events";
import { Client } from "./index";
import * as msgpack from "msgpack-lite";
import { Sign } from "./Sign";
import { Robot } from './Robot';

export class Room<Type> extends EventEmitter{
	public roomID: number;
	public roomName: string;

	protected clients: Client[] = [];
	public options: any;
	private movementType:number;

	private state: { [clientID:string]:any[] } = {};
	private gathered:any = {};

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
		this.movementType = options.movementType == Sign.DISCRETE_MOTION ? Sign.DISCRETE_MOTION : Sign.CONTINUE_MOTION;
		this.options = options;
		this.lock = false;

	}

	public getClientAmount(): number{
		return this.clients.length;
	}

	public requestJoin(): boolean{
		return !this.lock && this.clients.length < this.maxPlayer;
	}

	public start(){
		if(this.lock){
			console.log(`Room ${this.roomName}[${this.roomID}] start Simulation`);
			this.clients.forEach(client => {
				this.state[client.id] = [];
				let n = this.options.robotPerPlayer ;
				while(n--){
					let newRobot = new Robot({
						ownerID:client.id,
						ownerName:client.data.name});
					this.state[client.id].push({
						step:0,
						robot:newRobot,
					})
				}
			});
			this.runSimulation();
		}
	}

	public stop(){
		console.log(`Room ${this.roomName}[${this.roomID}] stop Simulation`);
		this.stopSimulation();
	}

	private runSimulation(){
		// TODO : broadcast -> gathering -> calculate then loop until stop

		// old
		// if(this.iteration) clearInterval(this.iteration);
		// this.iteration = setInterval(()=>{
		// 	this.calculate();
		// 	this.broadcast(this.state);
		// 	this.step++;
		// 	console.log(`${this.roomName}[${this.roomID}] step = `,this.step);
		// },1000);

		// new
		this.broadcast(this.state);
		this.on(`trigger_${this.roomID}`,(gatherData)=>{
			console.log(gatherData)
			this.calculate();
			this.step+=1;
			this.gathered = {};
			this.broadcast(this.state);
		});

	}

	private calculate(){
		Object.keys(this.state).forEach(clientID=>{
			this.state[clientID].forEach(robot=>{
				robot.step++;
			})
		});
		console.log(`${this.roomName}[${this.roomID}] step = `,this.step);
	}

	private stopSimulation(){
		// clearInterval(this.iteration);
		this.removeAllListeners(`trigger_${this.roomID}`);
		this.step = 0;
		this.state = {};
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

	public gathering(client:Client,data:any){
		if(data.step == this.step){
			this.gathered[client.id] = data;
			if(Object.keys(this.gathered).length == this.clients.length){
				console.log(`step ${this.step} trigerred`);
				this.emit(`trigger_${this.roomID}`,this.gathered);
			}
		}
	}

	public broadcast(data:any){
		let msg;
		this.clients.forEach((client) => {
			msg = msgpack.encode([Sign.ROOM_DATA,data[client.id],'data from server']);
			client.send(msg,this.msgOption)
		});
	}

	public onMessage(client:Client,message:any){
		let data = msgpack.decode(message);
		if(data[0] == Sign.CLIENT_DATA){
			console.log(`${this.roomName}[${this.roomID}] get data from user ${client.data.name}[${client.id}] `,data[1]);
			this.gathering(client,data[1])
		}
	}

	public onJoin(client:Client, options:any): void{
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
		client.on('message',this.onMessage.bind(this,client));
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