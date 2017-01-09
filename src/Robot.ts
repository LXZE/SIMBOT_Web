import { MatchController } from './matchController';
interface RobotSensors{
	smell:number,
	IR:number[],
}

export class Robot{
	private matchController:MatchController;
	public id:number;

	protected x:number;
	protected y:number;
	protected direction:number;
	protected collision:boolean;

	public target:number;
	public IR:any[];
	public ownerID:string;
	public ownerName:string;
	public options:any = {};

	constructor(ownerData:{ownerID:string,ownerName:string},matchController:MatchController, options:any = {}){
		this.ownerID = ownerData.ownerID;
		this.ownerName = ownerData.ownerName;
		this.matchController = matchController;
		this.x = options.x || Math.random()*1024;
		this.y = options.y || Math.random()*768;
		this.direction = options.direction || Math.random()*360;
		this.collision = false;

		this.IR = [255,255,255,255,255,255,255,255];

		this.options = options;
	}

	private checkSensor(x:number,y:number):boolean{
		// check sensor if too near to object or not
		return false;
	}

	public getSensorsValue():RobotSensors{
		//old scanSensor
		//old smell
	}

	private checkCollision(x:number,y:number):boolean{
		// check if robot collide with obstacle at given position
		return false;
	}

	public move(range:number){
		new_x = this.x+range*Math.cos(this.direction*Math.PI/180);
		new_y:this.y+range*Math.sin(this.direction*Math.PI/180);
		let collide = checkCollision;
		if(!collide)
		{
			this.x = new_x;
			this.y = new_y;
		}
		//TODO: set collision attribute here
	}

	public turn(degree:number){
		setDirection(this.direction+degree);
	}

	public moveForward(){
		move(5);
	}

	public moveBackward(){
		move(-5);
	}

	public turnRight(){
		setDirection(this.direction+5);
	}

	public turnLeft(){
		setDirection(this.direction-5);
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

	publ

}