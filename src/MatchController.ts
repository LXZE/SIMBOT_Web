import { Room } from './Room';
import { Map } from './Map';
import { Robot } from './Robot';

export interface Point{
	x:number,
	y:number,
}
interface Square{
	//anchor point top-left of the object
	x:number,
	y:number,
	width: number,
	height: number,
}
interface Circle{
	//anchor point to center of circle
	x:number,
	y:number,
	radius: number,
}

export class MatchController{
	private room:Room<any>;
	private robotList:Robot[];
	private map:Map;

	constructor(room:Room<any>,options:any = {}){
		this.room = room;
		// this.robotList = robots;
		this.map = new Map();
	}

	public placeRobot(robot:Robot){
		this.robotList.push(robot);
	}

	private squareCollided(A:Square, B:Square,countTouchAsCollide:boolean=false):boolean{
		if(countTouchAsCollide)
			return (A.x+A.width >= B.x && A.x <= B.x+B.width && A.y+A.height >= B.y && A.y <= B.y+B.height);
		else
			return (A.x+A.width > B.x && A.x < B.x+B.width && A.y+A.height > B.y && A.y < B.y+B.height);
		
	}
	private circleCollided(A:Circle, B:Circle,countTouchAsCollide:boolean=false):boolean{
		let dx = A.x-B.x;
		let dy = A.y-B.y;
		let dist = Math.sqrt(dx*dx+dy*dy);
		if(countTouchAsCollide)
			return dist<=(A.radius+B.radius);
		else
			return dist<(A.radius+B.radius);
	}
	public getFoodPosition():Point{
		return this.map.getFoodPosition();
	}
}