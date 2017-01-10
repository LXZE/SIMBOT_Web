import { MatchController } from './matchController';
import * as uid from 'shortid';

interface RobotSensors{
	smell:number,
	IR:number[],
}

export class Robot{
	public robotID:string;
	public ownerID:string;
	public ownerName:string;
	private matchController:MatchController;

	protected radius:number;
	protected x:number;
	protected y:number;
	protected direction:number;
	protected collision:boolean;

	protected irRange:number = 255;

	public target:number;
	public IR:any[];
	public options:any = {};

	constructor(ownerData:{ownerID:string,ownerName:string},matchController:MatchController, options:any = {}){
		this.robotID = uid.generate();
		this.ownerID = ownerData.ownerID;
		this.ownerName = ownerData.ownerName;
		this.matchController = matchController;
		this.radius = options.radius || 10;
		this.x = options.x || Math.random()*1024;
		this.y = options.y || Math.random()*768;
		//check robot position validity
		while(this.checkCollision(this.x,this.y)){
			this.x = Math.random()*1024;
			this.y = Math.random()*768;
		}

		this.direction = options.direction || Math.random()*360;
		this.collision = false;

		this.IR = [255,255,255,255,255,255,255,255];
		this.target = 0;

		this.options = options;
	}

	private distSensorRead(angle:number):number{
		let start = {x:this.x+(this.radius*Math.cos((angle)*Math.PI/180)),y:this.y+(this.radius*Math.cos((angle)*Math.PI/180))};
		let end = {x:this.x+((this.radius+this.irRange)*Math.cos((angle)*Math.PI/180)),y:this.y+((this.radius+this.irRange)*Math.cos((angle)*Math.PI/180))};
		let dist = this.matchController.distBetweenPoint(start,end);
		let data = this.matchController.distSensorScan(start,end,dist);
		if(data.detected){
			return data.distance;
		}
		else{
			return this.irRange;
		}
	}

	public getSensorsValue():RobotSensors{
		for (let i = 0; i < 8; i++) {
			this.IR[i] = this.distSensorRead(this.direction+i*45);
		}
		this.target = (this.matchController.getAngleToFood({x:this.x,y:this.y})-this.direction+360)%360;
		return {smell:this.target,IR:this.IR};
	}

	private checkCollision(x:number,y:number):boolean{
		// check if robot collide with obstacle at given position
		return !this.matchController.robotPlacementAllowed(x,y,this.radius);
	}

	public move(range:number){
		let new_x = this.x+range*Math.cos(this.direction*Math.PI/180);
		let new_y = this.y+range*Math.sin(this.direction*Math.PI/180);
		let collide = this.checkCollision(new_x,new_y);
		if(!collide){
			this.setPosition(new_x,new_y);
			this.collision = false;
		}
		else{
			this.collision = true;
		}
	}

	public turn(degree:number){
		this.setDirection(this.direction+degree);
	}

	public moveForward(){
		this.move(5);
	}

	public moveBackward(){
		this.move(-5);
	}

	public turnRight(){
		this.setDirection(this.direction+5);
	}

	public turnLeft(){
		this.setDirection(this.direction-5);
	}

	public setPosition(x:number, y:number){
		//TODO: we might want to have collision detection here
		this.x = x;
		this.y = y;
	}

	public setDirection(degree:number){
		if(degree >= 0 && degree <= 360){
			this.direction = degree;
		}
		else{
			this.direction = ((degree % 360) + 360) % 360;
		}
	}

	public getDirection(): number{
		return this.direction;
	}
}