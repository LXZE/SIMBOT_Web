<template lang="pug">
.container
	label Room list
	p
	#room(v-if="roomCount === 0")
		el-col(:span="20")
			el-card #[p No room created]
	#room(v-else)
		el-col(:span="20")
			el-row(v-for="(room,roomID) in roomList")
				el-card
					router-link.link(:to="{ name: 'watch', params: {roomID: roomID, roomName: room.roomName} }")
						| {{ room.roomName }}
					.status(v-if="room.status == 'ROOM_RUN'")
						i.el-icon-loading
						span &nbsp; Running
					.status(v-else)
						i.el-icon-time
						span &nbsp; Waiting
					p
					label(v-if="room.status !== 'ROOM_RUN'") Access Token = 
						| {{ room.roomToken }}
					label(v-else) &nbsp;
					el-button.deleteBtn(v-if="room.status !== 'ROOM_RUN'", type="danger", icon="delete", size="small", @click="deleteRoom(roomID)") Delete
				p 
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
	name: 'Container',
	data () {
		return {
			timer: '',
		}
	},
	methods: {
		...mapActions([
			'deleteRoom',
		]),
		getRooms () {
			this.$store.dispatch('getRooms')
		}	
	},
	
	computed: mapGetters({
		roomList: 'roomList',
		roomCount: 'roomCount',
	}),
	created: function(){
		this.getRooms()
    	this.timer = setInterval(this.getRooms,5000)
	},
	beforeDestroy() {
		clearInterval(this.timer)
	}

}
</script>

<style lang="sass"> 
.container {
	margin-left: 25%;
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