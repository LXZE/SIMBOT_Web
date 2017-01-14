<template lang="pug">
.container
	label Room list
	p
	#noRoom(v-if="this.roomList.length === 0")
		p No room created
	#room(v-else)
		el-col(:span="20")
			el-row(v-for="room in roomList")
				router-link.link(:to="{ name: 'watch', params: {roomID: room.roomID} }")
					el-card
						| {{ room.roomName }}
						.status(v-if="room.status == 'run'")
							i.el-icon-loading
							span &nbsp; Running
						.status(v-else)
							i.el-icon-time
							span &nbsp; Waiting
						p
						label(v-if="room.status !== 'run'") Access Token = 
							| {{ room.roomToken }}
						label(v-else) &nbsp;
						el-button.deleteBtn(type="danger", icon="delete", size="small") Delete
					p 
</template>
<script>

export default {
	name: 'Container',
	data () {
		return {
			roomList: [{
				roomName: 'Untitled1',
				status: 'run',
				roomID: 1,
				roomToken: 'arswftrcv'
			},{
				roomName: 'Untitled2',
				status: 'wait',
				roomID: 2,
				roomToken: 'nkpfndund'
			}]
		}
	},
	mounted: function(){
		this.getRoomData();	
	},
	methods: {
		getRoomData: function(){
			var url = '/room/'
			this.$http.get(url).then((res)=>{
				console.log('response', res.data);
				// this.roomList = [];
			})
		}
	}
}
</script>

<style lang="scss"> 
.container {
	margin-left: 250px;
	.status {
		float: right;
		* {
			display: inline-block;
		}
	}
	label{
		margin: 0px 0px 50px 0px;
	}
	.link {
		text-decoration: none;
	}
}
button.deleteBtn {
	float: right;
}
#room a {
	color: #181818;
}
#room a:hover {
	color: #9e9e9e;
}
</style>