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
export interface SensorInfo{
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

	public clearRobot(){
		this.robotList = [];
	}

	public getFoodPosition():Point{
		return this.map.getFoodPosition();
	}

	public getRobotData():Robot[]{
		return this.robotList;
	}
	public distSensorScan(start:Point,end:Point):SensorInfo{
		let line = {a:start,b:end};
		let length = this.lineLength(line)
		let distSeen = [];
		//map boundary check
		let mapSize = this.map.getMapSize();
		let mapRectangle = {x:0,y:0,x2:mapSize.x,y2:mapSize.y};
		distSeen.push(this.lineRectangleIntersect(line,length,mapRectangle));
		//obstacle check
		let obs = this.map.getObstacles();
		for (let ob of obs) {
			distSeen.push(this.lineRectangleIntersect(line,length,ob));
		}
		//other robot check - not implemented

		//keep lowest value
		let dist = distSeen.filter(function(x){
			return x.detected;
		}).map(function(x){
			return x.distance;
		}).reduce(function(x,y){
			return (x<y)?x:y;
		},length);
		return dist;
	}
	public getAngleToFood(a:Point):number{
		let food = this.getFoodPosition();
		return Math.atan2(food.y-a.y,food.x-a.x)*180/Math.PI;

	}

	public robotPlacementAllowed(x:number,y:number,radius:number):boolean{
		let robotCircle = {x:x,y:y,radius:radius};
		//map boundary check
		let mapSize = this.map.getMapSize();
		let mapRectangle = {x:0,y:0,x2:mapSize.x,y2:mapSize.y};
		if(!this.circleInRectangle(robotCircle,mapRectangle))
		{
			return false;
		}
		else
		{
			//obstacle check
			let obs = this.map.getObstacles();
			for (let ob of obs)
			{
				if(this.circleRectangleCollided(robotCircle,ob)){
					return false;
				}
			}
			//other robot check - not implemented
			return true;
		}
	}

	private getLinesFromRectangle(A:Rectangle):Line[]{
		// return [{x1:A.x, y1:A.y, x2:A.x, y2:A.y2},	{x1:A.x, y1:A.y2, x2:A.x2, y2:A.y2}, {x1:A.x2, y1:A.y2, x2:A.x2, y2:A.y}, {x1:A.x2, y1:A.y, x2:A.x, y2:A.y} ];
		return [{a:{x:A.x,y:A.y},b:{x:A.x,y:A.y2}},{a:{x:A.x,y:A.y2},b:{x:A.x2,y:A.y2}},{a:{x:A.x2,y:A.y2},b:{x:A.x2,y:A.y}},{a:{x:A.x2,y:A.y},b:{x:A.x,y:A.y}}];
	}
	private distBetweenPoint(A:Point,B:Point):number{
		let dx = A.x-B.x;
		let dy = A.y-B.y;
		return Math.sqrt(dx*dx+dy*dy);
	}
	private lineLength(A:Line):number{
		return this.distBetweenPoint(A.a,A.b);
	}
	private getLineIntersect(A:Line,B:Line):any{
		let x1 = A.a.x;
		let x2 = A.b.x;
		let x3 = B.a.x;
		let x4 = B.b.x;
		let y1 = A.a.y;
		let y2 = A.b.y;
		let y3 = B.a.y;
		let y4 = B.b.y;
		let denominator = ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
		if(denominator==0)
		{
			//parallel or coincident
			//detect parallel line that is not horizontal or vertical may be tricky, so this function still not support it yet
			return 0;
		}
		let detPtA = (x1*y2-y1*x2);
		let detPtB = (x3*y4-y3*x4);
		let px = (detPtA*(x3-x4)-(x1-x2)*detPtB)/denominator;
		let py = (detPtA*(y3-y4)-(y1-y2)*detPtB)/denominator;
		return {x:px,y:py};

	}
	private lineRectangleIntersect(a:Line,l:number,b:Rectangle):SensorInfo{
		let bLines = this.getLinesFromRectangle(b);
		for (let line of bLines){
			let crossPoint = this.getLineIntersect(a,line);
			if(crossPoint!=0)
			{
				if(this.pointOnRectangle(crossPoint,b))
				{
					let dist = this.distBetweenPoint(crossPoint,a.a);
					if(dist <= l){
						return {detected:true,distance:dist};
					}
				}
			}
		}
		return {detected:false};
	}
	private circleInRectangle(A:Circle, B:Rectangle):boolean{
		return (A.x-A.radius>=B.x) && (A.y-A.radius>=B.y) && (A.x+A.radius<=B.x2) && (A.y+A.radius<=B.y2);
	}
	private pointOnRectangle(A:Point, B:Rectangle):boolean{
		return (A.x>=B.x) && (A.y>=B.y) && (A.x<=B.x2) && (A.y<=B.y2);
	}
	private circleRectangleCollided(A:Circle, B:Rectangle, countTouchAsCollide:boolean=false):boolean{
		//check circle center in rectangle
		if(A.x >= B.x && A.x <= B.x2 && A.y >= B.y && A.y <= B.y2){
			return true;
		}
		else{
			//check if 4 side of regtangle intersect with circle
			let lines = this.getLinesFromRectangle(B);
			for (let line of lines) {
				let x1 = line.a.x;
				let x2 = line.b.x;
				let y1 = line.a.y;
				let y2 = line.b.y;
				let dy = y2-y1;
				let dx = x2-x1;
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
		let dist = this.distBetweenPoint(A,B);
		if(countTouchAsCollide)
			return dist<=(A.radius+B.radius);
		else
			return dist<(A.radius+B.radius);
	}
}