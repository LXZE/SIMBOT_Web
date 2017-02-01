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
import { Stomp } from 'stompjs/lib/stomp.js'

export default {
	name: 'Watch',
	data () {
		return {
			// TODO: change to localhost on production
			url: '10.35.23.97',

			loading: false,
			id: '',
			name: '',
				
			client: '',

			obstacles:[], //array of object with these attr:x,y,x2,y2
			robotRadius:10,
			step: 0,
			robots:[],	//array of object with these attr:x,y,direction,color1,color2
			foodPosition:{x:0,y:0},	//accept only single food
			stateUnderAccess:false,

			//cache for drawing
			drawingStep:0,
			drawingRobots:[],
			drawingFoodPosition:{x:0,y:0},
			drawRequested:false,
		}
	},
	methods: {
		// getRobotData: function(){

		// },
		on_connect (x) {
			var id = this.client.subscribe("/queue/test", function(m) {
				console.log('ws connect: ',m.body);
			});
		},
		on_error () {
			console.log('error');
		},
		fetchData (){

			var ws = new WebSocket(`ws://${this.url}:15674/ws`)
			this.client = Stomp.over(ws);
      		this.client.connect('guest', 'guest', this.on_connect, this.on_error, '/');
			this.client.onreceive = function(m) {
				console.log('Stomp get: ',m.body);
			}

			this.loading = true;
			this.id = this.$route.params.roomID;
			this.name = this.$route.params.roomName;
			
			//do the data fetching
			this.stateUnderAccess = true;
			//update value
			this.stateUnderAccess = false;
			
			if(!this.drawRequested){
				this.drawRequested = true;
				// requestAnimationFrame(draw);
			}
			this.loading = false;
		},
		draw (){
			//this.loading = false;
			//clone state to drawingState
			//CRITICAL SECTION
			this.stateUnderAccess = true;
			this.drawingStep = this.step;
			this.drawingRobots = this.robots.slice(0);
			this.drawingFoodPosition = {x:this.foodPosition.x,y:this.foodPosition.y};
			this.stateUnderAccess = false;
			//END CRITICAL SECTION
			this.drawRequested = false;

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
			ctx.fillRect (this.drawingFoodPosition.x-10,this.drawingFoodPosition.y-10,20,20);
		},
		drawRobot (ctx){
			//simple robot painting as a sample
			ctx.strokeStyle = "rgb(0,0,0)";
			//iterate robot from list
			for(let robot of this.drawingRobots){
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
	},
	beforeDestroy (){
		this.client.disconnect(function() {
			console.log("Client disconnect from MQ");
		});

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