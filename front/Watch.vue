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
</template>

<script>
export default {
	name: 'Watch',
	data () {
		return {
			loading: false,
			id: '',
			name: '',
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
			this.drawRobot(ctx);
		},
		drawRobot (ctx){
			ctx.beginPath();
			ctx.arc(100,75,50,0,2*Math.PI);
			ctx.stroke();
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