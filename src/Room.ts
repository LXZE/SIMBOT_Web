import { EventEmitter } from "events";
import { Client } from "./index";
import { Sign } from "./Sign";
import { Robot } from './Robot';
import { MatchController } from './MatchController';

import * as util from 'util';
import * as msgpack from "msgpack-lite";
import * as _ from 'underscore';
import * as Amqp from "amqp-ts";

import { config } from 'dotenv';
config()

export class Room<Type> extends EventEmitter{
	public roomID: number;
	public roomName: string;

	protected clients: Client[] = [];
	public options: any;
	private movementType:number;

	private state: { [clientID:string]:any[] } = {};
	private gathered:any = {};

	protected step:number = 0;
	public maxPlayer: number;
	protected lock: boolean;
	protected status: number;

	private msgOption:{} = {binary:true};

	private matchCTRL:MatchController;

	private mqConn:any;
	private exchange:any;

	constructor(options: any = {}){
		super();

		this.roomID = options.roomID;
		this.roomName = options.roomName;
		this.maxPlayer = options.maxPlayer;
		this.movementType = options.movementType == Sign.DISCRETE_MOTION ? Sign.DISCRETE_MOTION : Sign.CONTINUE_MOTION;
		this.options = options;
		this.lock = false;
		this.status = Sign.ROOM_STOP;

		try{
			console.info('Connect to MQ server...');
			this.mqConn = new Amqp.Connection(`amqp://guest:guest@${process.env.MQ_URL}:5672`);
		}catch(e){
			console.error('Cannot connect to mq server');
			throw new Error('Cannot connect to mq server');
		}
		this.exchange = this.mqConn.declareExchange('simbot_exchange');
		this.exchange.send(new Amqp.Message('Test'));
	}

	public getClientAmount(): number{
		return this.clients.length;
	}

	public requestJoin(): boolean{
		return !this.lock && this.clients.length < this.maxPlayer && this.status == Sign.ROOM_STOP;
	}

	public start(){
		if(this.lock && this.status == Sign.ROOM_STOP){
			console.log(`Room ${this.roomName}[${this.roomID}] start Simulation`);
			this.matchCTRL = new MatchController(this);

			this.clients.forEach(client => {
				this.state[client.id] = [];
				let n = this.options.robotPerPlayer;
				let newRobot;
				while(n--){
					newRobot = new Robot({
						ownerID:client.id,
						ownerName:client.data.name},this.matchCTRL);
					this.matchCTRL.placeRobot(newRobot);
				}
			});
			let robotData = this.matchCTRL.getRobotData();
			let tmpRobot;
			(<any>Object).entries(robotData).forEach(([robotID,robot])=>{
				tmpRobot = _.pick(robot,['IR','smell','ownerID','robotID'])
				this.state[robot.ownerID].push({step:this.step,robot:tmpRobot});
			});
			this.status = Sign.ROOM_RUN;
			this.runSimulation();
		}
	}

	private setState(){

		let robotData = this.matchCTRL.getRobotData();
		let tmpRobot;
		(<any>Object).entries(robotData).forEach(([robotID,robotInfo])=>{
			tmpRobot = _.pick(robotInfo,['IR','smell','ownerID','robotID'])
			try{
				let idx = this.state[robotInfo.ownerID].findIndex((elem)=>{
					return elem.robot.robotID == tmpRobot.robotID
				})
				this.state[robotInfo.ownerID][idx].robot = tmpRobot;
				this.state[robotInfo.ownerID][idx].step+=1;
			}catch(e){
				this.matchCTRL.removeRobot(robotID);
			}
		});
	}

	public pause(){
		console.log(`Room ${this.roomName}[${this.roomID}] pause Simulation`);
		this.removeAllListeners(`trigger_${this.roomID}`);
		this.status = Sign.ROOM_PAUSE;
	}

	public resume(){
		console.log(`Room ${this.roomName}[${this.roomID}] resume Simulation`);
		this.runSimulation();
		this.status = Sign.ROOM_RUN;
	}

	public stop(){
		console.log(`Room ${this.roomName}[${this.roomID}] stop Simulation`);
		this.stopSimulation();
		this.status = Sign.ROOM_STOP;
	}

	private runSimulation(){
		this.broadcast(this.state);
		this.on(`trigger_${this.roomID}`,(gatherData)=>{		
			this.step+=1;
			this.calculate(gatherData);
			this.gathered = {};
			this.broadcast(this.state);
		});
	}

	private calculate(gatherData:any){
		(<any>Object).entries(gatherData).forEach(([ownerID,data])=>{
			this.matchCTRL.doCommand(data.command,parseInt(data.type),this.movementType);
		})
		this.setState();
		console.log(`${this.roomName}[${this.roomID}] step = `,this.step);
	}

	private stopSimulation(){
		this.removeAllListeners(`trigger_${this.roomID}`);
		this.step = 0;
		this.state = {};
		this.matchCTRL.clearRobot();
	}

	public getCurrentLock(): boolean{
		return this.lock;
	}

	public getCurrentStatus(): number{
		return this.status;
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
			try{
				client.send(msg,this.msgOption);
			}catch(e){
				console.log(`${client.data.name}[${client.id}] error occured`,e.message);
				this.removeClient(client);
			}
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
		this._onLeave(client,true)
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
		if(this.removeClient(client)){
			delete this.state[client.id];
		}
		// this.onLeave(client);
		this.emit('leave', client, isDisconnect);
		if (!isDisconnect) {
			client.send(msgpack.encode([Sign.ROOM_LEAVE,this.roomID]),this.msgOption);			
		}
	}
	private removeClient(client:Client):boolean{
		if(this.clients.indexOf(client) !== -1){
			this.clients.splice(this.clients.indexOf(client),1);
			return true;
		}
		return false;
	}

}