import { Room } from './Room';
import { Map } from './Map';
import { Robot } from './Robot';
import * as Geometry from './Geometry';


export interface SensorInfo{
	detected:boolean,
	distance?:number,
}

export class MatchController{
	private room:Room<any>;
	private robotList:{[robotID:string]:Robot} = {};
	private map:Map;

	constructor(room:Room<any>,options:any = {}){
		this.room = room;
		this.map = new Map();
	}

	public placeRobot(robot:Robot){
		this.robotList[robot.robotID] = robot;
		let sensorValue = robot.getSensorsValue();
		this.robotList[robot.robotID] = (<any>Object).assign(robot,sensorValue)

	}

	public removeRobot(robotID:string){
		delete this.robotList[robotID]
	}

	public clearRobot(){
		this.robotList = {};
	}

	private setRobotSensorValue(){
		(<any>Object).entries(this.robotList).forEach(([robotID,robot])=>{
			let sensorValue = robot.getSensorsValue();
			this.robotList[robotID] = (<any>Object).assign(robot,sensorValue);
		})
	}

	public doCommand(command:any,commandType:number,setMovementType:number){
		// TODO: arrange command of robot
		(<any>Object).entries(command).forEach(([robotID,command])=>{
			if(commandType == setMovementType){
				if('move' in command) this.robotList[robotID].move(command.move);
				if('turn' in command) this.robotList[robotID].turn(command.turn);
			}
		});
		this.setRobotSensorValue();
	}

	public getFoodPosition():Point{
		return this.map.getFoodPosition();
	}

	public getRobotData():{[robotID:string]:Robot}{
		return this.robotList;
	}
	public distSensorScan(start:Geometry.Point,end:Geometry.Point):SensorInfo{
		let line = {a:start,b:end};
		let length = Geometry.lineLength(line);
		let pointList = [];
		//map boundary check
		let mapSize = this.map.getMapSize();
		let mapRectangle = {x:0,y:0,w:mapSize.x,h:mapSize.y};
		pointList.concat(Geometry.getLineRectangleIntersectPoints(line,mapRectangle));

		//obstacle check
		let obs = this.map.getObstacles();
		for (let ob of obs) {
			pointList.concat(Geometry.getLineRectangleIntersectPoints(line,mapRectangle));
		}
		//other robot check - not implemented

		//keep lowest value
		let dist = pointList.map((x)=> Geometry.distBetweenPoints(start,x)).reduce((x,y)=>(x<y)?x:y);
		if(dist<length){
			return {detected:true, distance:dist};
		}
		else{
			return {detected:false};
		}
	}
	public getAngleToFood(a:Point):number{
		let food = this.getFoodPosition();
		return Math.atan2(food.y-a.y,food.x-a.x)*180/Math.PI;
		//TODO: may move angle calculation to geometry
	}

	public robotPlacementAllowed(x:number,y:number,radius:number):boolean{
		let robotCircle = {x:x,y:y,radius:radius};
		//map boundary check
		let mapSize = this.map.getMapSize();
		let mapRectangle = {x:0,y:0,w:mapSize.x,h:mapSize.y};
		if(!Geometry.isCircleInRectangle(robotCircle,mapRectangle))
		{
			return false;
		}
		else
		{
			//obstacle check
			let obs = this.map.getObstacles();
			for (let ob of obs)
			{
				if(Geometry.isCollidedCircleRectangle(robotCircle,ob)){
					return false;
				}
			}
			//other robot check - not implemented
			return true;
		}
	}
}
