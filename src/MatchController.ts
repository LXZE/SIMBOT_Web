import { Room } from './Room';
import { Map } from './Map';
import { Robot} from './Robot';

export class Point{
	public x:number;
	public y:number;
}
class Square extends Point{
	//anchor point top-left of the object
	public width: number;
	public height: number;
}
class circle extends Point{
	public radius: number;
}

export class MatchController{
	private room:Room;
	private robotList:Robot[];
	private map:Map;

	constructor(options:any = {}){
		//TODO: link room to room var
		//TODO: instance a map
		//TODO: instance or load robots
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
}