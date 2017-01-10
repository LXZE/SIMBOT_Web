import { Point, Rectangle } from './matchController';

export class Map{

	protected size:Point;
	protected foodPosition:Point;
	protected obstacles:Rectangle[] = [];

	public getMapSize():Point {
		return this.size;
	}
	public getFoodPosition() : Point {
		return this.foodPosition;
	}
	public setFoodPosition(foodPosition : Point) {
		this.foodPosition = foodPosition;
	}
	public getObstacles():Rectangle[]{
		return this.obstacles;
	}

	constructor(options:any = {}){
		//TODO: convert obstacle list to load from file
		this.size = {x:800, y:400};
		let x1 = [90,270,210,210,490,490,490,630,630];
		let x2 = [140,370,340,340,540,540,540,660,660];
		let y1 = [90,130,330,0,70,0,380,240,10];
		let y2 = [310,270,400,70,330,20,400,390,160];
		for(let i=0;i<9;i++)
		{
			let ob = {x:x1[i],x2:x2[i],y:y1[i],y2:y2[i]};
			this.obstacles.push(ob);
		}
		this.setFoodPosition({x:720,y:210});
	}
}