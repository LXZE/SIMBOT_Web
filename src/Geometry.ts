export interface Point{
	x:number,
	y:number,
}
export interface Rectangle{
	//limit to axis-parallel rectangle
	//x,y - top left point of the rectangle
	x:number,
	y:number,
	w:number,	//rectangle width, same axis with x
	h:number,	//rectangle height, same axis with y
}
export interface Line{
	a:Point,
	b:Point,
}
export interface Circle{
	x:number,
	y:number,
	r:number,
}

export function getLinesFromRectangle(p:Rectangle):Line[]{
	/*
	let x = p.x;
	let y = p.y;
	let w = p.w;
	let h = p.h;
	let l1 = {a:{x:x,y:y},b:{x:x,y:y+h}};
	let l2 = {a:{x:x,y:y+h},b:{x:x+w,y:y+h}};
	let l3 = {a:{x:x+w,y:y+h},b:{x:x+w,y:y}};
	let l4 = {a:{x:x+w,y:y},b:{x:x,y:y}};
	return [l1,l2,l3,l4];
	*/
	let points = getPointsFromRectangle(p);
	let l1 = {a:p[0],b:p[1]};
	let l2 = {a:p[1],b:p[2]};
	let l3 = {a:p[2],b:p[3]};
	let l4 = {a:p[3],b:p[0]};
	return [l1,l2,l3,l4];
}
export functions getPointsFromRectangle(p:Rectangle):Point[]{
	let x = p.x;
	let y = p.y;
	let w = p.w;
	let h = p.h;
	let p1 = {x:x,y:y};
	let p2 = {x:x,y:y+h};
	let p3 = {x:x+w,y:y+h};
	let p4 = {x:x+w,y:y};
	return [p1,p2,p3,p4];1
}

export function distBetweenPoints(a:Point,b:Point):number{
	let dx = A.x-B.x;
	let dy = A.y-B.y;
	return Math.sqrt(dx*dx+dy*dy);
}
export function lineLength(a:Line):number{
	return distBetweenPoints(a.a,a.b);
}

export function getLineIntersectPoint(a:Line,b:Line):any{
	let x1 = a.a.x;
	let x2 = a.b.x;
	let x3 = b.a.x;
	let x4 = b.b.x;
	let y1 = a.a.y;
	let y2 = a.b.y;
	let y3 = b.a.y;
	let y4 = b.b.y;
	let denominator = ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
	if(denominator==0){
		//parallel or coincident
		//parallel line detection for line not horizontal or vertical are tricky
		//so it is not implemented yet
		return 0;
	}
	let detPtA = x1*y2-y1*x2;
	let detPtB = x3*y4-y3*x4;
	let px = (detPtA*(x3-x4)-(x1-x2)*detPtB)/denominator;
	let py = (detPtA*(y3-y4)-(y1-y2)*detPtB)/denominator;
	return {x:px,y:py};
}
export function getLineRectangleIntersectPoints(a:Line,b:Rectangle):Point[]{
	let bLines = getLinesFromRectangle(b);
	let crossPoints = [];
	for(let line of bLines){
		let crossPoint = this.getLineIntersectPoint(a,line);
		if(crossPoint!=0){
			crossPoints.push(crossPoint);
		}
	}
	return crossPoints;
}

export function isCircleInRectangle(a:Circle,b:Rectangle):boolean{
	return (a.x-a.r>=b.x) && (a.x+a.r<=b.x+b.w) && (a.y-a.r>=b.y) && (a.y+a.r<=b.y+b.h);
}
export function isPointOnRectangle(a:Point,b:Rectangle):boolean{
	return (a.x>=b.x) && (a.x<=b.x+b.w) && (a.y>=b.y) && (a.y<=b.y+b.h);
}

export function isCollidedCircleRectangle(a:circle,b:Rectangle,touchCollide:boolean=false):boolean{
	//Method 1: check if circle center is in rectangle, then check if circle intersect any rectangle's line
	//not implemented

	//Method 2
	//check if circle center is in rectangle
	if(isPointOnRectangle(a,b)){
		return true;
	}

	//check if circle is far enough from rectangle
	if(touchCollide){
		if(a.x < b.x-a.r || a.x > b.x+b.w+a.r || a.y < b.y-a.r || a.y > b.y+b.h+a.r){
			return false;
		}
	}
	else{
		if(a.x <= b.x-a.r || a.x >= b.x+b.w+a.r || a.y <= b.y-a.r || a.y >= b.y+b.h+a.r){
			return false;
		}
	}

	//check if circle center is in the same level to the rectangle (not the corner case)
	if(a.x >= b.x && a.x <= b.x+b.w){
		return true;
	}
	if(a.y >= b.y && a.y <= b.y+b.h){
		return true;
	}

	//corner case - check distance
	let points = getPointsFromRectangle(b);
	if(touchCollide){
		for(let point of points){
			if(distBetweenPoints(a,point)<=a.r){
				return true;
			}
		}
	}
	else{
		for(let point of points){
			if(distBetweenPoints(a,point)<a.r){
				return true;
			}
		}
	}
	return false;
}
export function isCollidedRectangles(a:Rectangle,b:Rectangle,touchCollide:boolean=false):boolean{
	if(touchCollide){
		return a.x+a.w>=b.x && a.x<=b.x+b.w && a.y+a.h>=b.y && a.y<=b.y+b.h;
	}
	else{
		return a.x+a.w>b.x && a.x<b.x+b.w && a.y+a.h>b.y && a.y<b.y+b.h;
	}
}
export function isCollidedCircles(a:Circle,b:Circle,touchCollide:boolean=false):boolean{
	let dist = distBetweenPoints(a,b);
	if(touchCollide){
		return dist<=a.r+b.r;
	}
	else{
		return dist<a.r+b.r;
	}
}
