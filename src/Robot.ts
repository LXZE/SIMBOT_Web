export class Robot{

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

	constructor(ownerData:{ownerID:string,ownerName:string}, options:any = {}){
		this.ownerID = ownerData.ownerID;
		this.ownerName = ownerData.ownerName;
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

	private scanSensor(){
		// set new IR value
	}

	private checkWall(x:number,y:number):boolean{
		// check if robot collision then set collision value
		return false;
	}

	public smell():number{
		// return target direction
		return null;
	}

	public move(range:number){

	}

	public turn(degree:number){

	}

	public moveForward(){

	}

	public moveBackward(){

	}

	public turnRight(){
		
	}

	public turnLeft(){
		
	}

	public setPosition(x:number, y:number){
		this.x = x;
		this.y = y;
	}

	public setDirection(degree:number){
		if(degree >= 0 && degree <= 360){
			this.direction = degree;
		}
	}

	public getDirection(): number{
		return this.direction;
	}
}