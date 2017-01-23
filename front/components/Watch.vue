<template lang="pug">
.watch
	.content
		.row
			router-link(to="/")
				el-button
					i.el-icon-arrow-left
			span &nbsp; Room {{ name }} - [ ID : {{ id }} ]
		.row
			canvas#robotCanvas(width='800', height='400')
		.row
			span Step : {{ step }}
</template>

<script>
export default {
	name: 'Watch',
	data () {
		return {
			loading: false,
			id: '',
			name: '',
			step: 0,
			robots:[],	//array of object with these attr:x,y,direction,color1,color2
			robotRadius:10,
			obstacles:[],//array of object with these attr:x,y,x2,y2
			foodPosition:{x:0,y:0},	//accept only single food
		}
	},
	methods: {
		// getRobotData: function(){

		// },
		fetchData (){
			this.loading = true;
			this.id = this.$route.params.roomID;
			this.name = this.$route.params.roomName;
			// this.draw();
		},
		draw (){
			this.loading = false;
			var canvas = document.getElementById('robotCanvas');
			var ctx = canvas.getContext('2d');
			var centerX = canvas.width / 2;
			var centerY = canvas.height / 2;
			var radius = 70;
			ctx.clearRect(0,0,800,600);	//clear frame
			this.drawStage(ctx);
			this.drawFood(ctx);
			this.drawRobot(ctx);
		},
		drawStage (ctx){
			//stage border ignored, set in css already
			ctx.strokeStyle = "rgb(0,0,0)";
			ctx.fillStyle = "rgba(200,200,200,0.4)";
			for (let ob of this.obstacles){
				fillRect(ob.x,ob.y,ob.x2-ob.x,ob.y2-ob.y);
				strokeRect(ob.x,ob.y,ob.x2-ob.x,ob.y2-ob.y);
			}
		},
		drawFood (ctx){
			ctx.fillStyle = "rgb(0,200,0)";
			ctx.fillRect (this.foodPosition.x-10,this.foodPosition.y-10,20,20);
		},
		drawRobot (ctx){
			//simple robot painting as a sample
			ctx.strokeStyle = "rgb(0,0,0)";
			// ctx.beginPath();
			// ctx.arc(100,75,50,0,2*Math.PI);
			// ctx.stroke();
			//iterate robot from list
			for(let robot of this.robots){
				//style value are depend on robot owner and other...
				ctx.strokeStyle = robot.color1;
				ctx.fillStyle = robot.color2;

				//robot body
				ctx.beginPath();
				//ctx.moveTo(robot.x,robot.y);
				ctx.arc(robot.x,robot.y,this.robotRadius,0,2*Math.PI);
				ctx.fill();
				ctx.stroke();

				//robot direction line
				ctx.beginPath();
				ctx.moveTo(robot.x,robot.y);
				ctx.lineTo(robot.x+this.robotRadius*Math.cos(robot.direction*Math.PI/180),robot.y+this.robotRadius*Math.sin(robot.direction*Math.PI/180));
				ctx.stroke();
				
				//robot direction marker (head)
				ctx.fillStyle = robot.color1;
				ctx.fillRect(robot.x+this.robotRadius*0.5*Math.cos(robot.direction*Math.PI/180)-0.2*this.robotRadius,robot.y+this.robotRadius*0.5*Math.sin(robot.direction*Math.PI/180),this.robotRadius*0.4,this.robotRadius*0.4);
			}

		}
	},
	mounted (){
		this.draw();
	},
	created (){
		this.fetchData();
	}
}
</script>

<style lang="scss">
.watch {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	margin-top: 10px;
}
.row {
	margin: 5px 0px 5px 0px;
}
#robotCanvas {
	border:1px solid #000000;
}
</style>