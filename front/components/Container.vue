<template lang="pug">
.container
	label Room list
	p
	#noRoom(v-if="this.roomList.length === 0")
		el-col(:span="20")
			el-card #[p No room created]
	#room(v-else)
		el-col(:span="20")
			el-row(v-for="(room,roomIdx) in roomList")
				el-card
					router-link.link(:to="{ name: 'watch', params: {roomID: room.roomID, roomName: room.roomName} }")
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
					el-button.deleteBtn(type="danger", icon="delete", size="small", @click="deleteRoom(roomIdx)") Delete
				p 
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'Container',
	// data () {
	// 	return {
	// 		roomList: [],
	// 	}
	// },
	mounted: function(){
		// this.getRoomData();	
	},
	methods: mapActions([
		'deleteRoom'
	]), 
	computed: mapGetters({
		roomList: 'roomList'
	}),

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