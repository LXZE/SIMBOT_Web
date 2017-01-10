import { Room } from './Room';
import { Map } from './Map';
import { Robot } from './Robot';

export interface Point{
	x:number,
	y:number,
}
export interface Rectangle{
	//anchor point top-left of the object
	//maintain x<x2 and y<y2 by user
	x:number,
	y:number,
	x2: number,
	y2: number,
}
interface Line{
	a:Point,
	b:Point,
}
interface Circle{
	//anchor point to center of circle, assume r>0
	x:number,
	y:number,
	radius: number,
}
interface SensorInfo{
	detected:boolean,
	distance?:number,
}

export class MatchController{
	private room:Room<any>;
	private robotList:Robot[] = [];
	private map:Map;

	constructor(room:Room<any>,options:any = {}){
		this.room = room;
		this.map = new Map();
	}

	public placeRobot(robot:Robot){
		this.robotList.push(robot);
	}

	public getFoodPosition():Point{
		return this.map.getFoodPosition();
	}

	public getRobotData():Robot[]{
		return this.robotList;
	}

	public robotPlacementAllowed(x:number,y:number,radius:number):boolean{
		let robotCircle = {x:x,y:y,radius:radius};
		let mapSize = this.map.getMapSize();
		let mapRectangle = {x:0,y:0,x2:mapSize.x,y2:mapSize.y};
		if(!this.circleInRectangle(robotCircle,mapRectangle))
		{
			return false;
		}
		else
		{
			let obs = this.map.getObstacles();
			for (let ob of obs)
			{
				if(this.circleRectangleCollided(robotCircle,ob)){
					return false;
				}
			}
			return true;
		}
	}
	private circleInRectangle(A:Circle, B:Rectangle):boolean{
		return (A.x-A.radius>=B.x) && (A.y-A.radius>=B.y) && (A.x+A.radius<=B.x2) && (A.y+A.radius<=B.y2);
	}
	private pointOnRectangle(A:Point, B:Rectangle):boolean{
		return (A.x>=B.x) && (A.y>=B.y) && (A.x<=B.x2) && (A.y<=B.y2);
	}
	private lineRectangleIntersect(A:Line,B:Rectangle):SensorInfo{
		if((A.a.x<B.x&&A.b.x<B.x) || (A.a.x>B.x2&&A.b.x>B.x2) || (A.a.y<B.y&&A.b.y<B.y) || (A.a.y>B.y2&&A.b.y>B.y2)){
			return {detected:false};
		}
		//TODO : write this function to complete sensor scanning
		//think of it as hit-scan projectile

	}
	private circleRectangleCollided(A:Circle, B:Rectangle, countTouchAsCollide:boolean=false):boolean{
		//check circle center in rectangle
		if(A.x >= B.x && A.x <= B.x2 && A.y >= B.y && A.y <= B.y2){
			return true;
		}
		else{
			//check if 4 side of regtangle intersect with circle
			let lines = [{x1:B.x, y1:B.y, x2:B.x, y2:B.y2},	{x1:B.x, y1:B.y2, x2:B.x2, y2:B.y2}, {x1:B.x2, y1:B.y2, x2:B.x2, y2:B.y}, {x1:B.x2, y1:B.y, x2:B.x, y2:B.y} ];
			for (let line of lines) {
				let x1 = line.x1;
				let x2 = line.x2;
				let y1 = line.y1;
				let y2 = line.y2;
				let dy = line.y2-line.y1;
				let dx = line.x2-line.x1;
				let x0 = A.x;
				let y0 = A.y;
				let dist = Math.abs(dy*x0-dx*y0+x2*y1-y2*x1)/Math.sqrt(dy*dy+dx*dx);
				if(countTouchAsCollide)
				{
					if(dist <= A.radius){
						return true;
					}
				}
				else
				{
					if(dist < A.radius){
						return true;
					}
				}
			}
			return false;
		}
	}

	private rectangleCollided(A:Rectangle, B:Rectangle,countTouchAsCollide:boolean=false):boolean{
		if(countTouchAsCollide)
			return (A.x2 >= B.x && A.x <= B.x2 && A.y2 >= B.y && A.y <= B.y2);
		else
			return (A.x2 > B.x && A.x < B.x2 && A.y2 > B.y && A.y < B.y2);
		
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
}