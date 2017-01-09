import { Point } from './matchController';

interface Obstacle{
	x1:number,
	x2?:number,
	y1:number,
	y2?:number
}

export abstract class Map{

	protected Food:Point;
	protected obstacle:Obstacle[];

	constructor(options:any = {}){
	}
}