import { Point } from './matchController';

interface Obstacle{
	x1:number,
	x2?:number,
	y1:number,
	y2?:number
}

export class Map{

	protected _foodPosition:Point;
	protected obstacle:Obstacle[];

	public get foodPosition() : Point {
		return _foodPosition;
	}
	public set foodPosition(foodPosition : Point) {
		this._foodPosition = foodPosition;
	}
	//public newFoodPosition():void;

	constructor(options:any = {}){
		//TODO: convert obstacle list to load from file
		let x1 = [100,280,220,220,500,500,500,640,640];
		let x2 = [150,380,350,350,550,550,550,670,670];
		let y1 = [100,140,340,10,80,10,390,250,20];
		let y2 = [320,280,410,80,340,30,410,400,170];
		for(let i=0;i<9;i++)
		{
			let obs = {x1:x1[i],x2:x2[i],y1:y1[i],y2:y2[i]};
			obstacle.push(obs);
		}
		this.foodPosition = {x:720,y:210};

	}
}