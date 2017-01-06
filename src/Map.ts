interface Obstacle{
	x1:number,
	x2?:number,
	y1:number,
	y2?:number
}

export abstract class Map{

	private Food_x:number;
	private Food_y:number;

	private obstacle:Obstacle[];

	constructor(options:any = {}){
		
	}
}