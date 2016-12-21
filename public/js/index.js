var screenEnum={
	ROOMLIST:0,
	CREATEROOM:1,
}
Vue.component('room-list-pane',{
	template:document.getElementById('roomListTemplate').innerHTML,
	data:{
		rooms: getRoomList()
	}
})
var vm = new Vue({
	el: '#app',
	data:{
		currentView:screenEnum.ROOMLIST,
	},
	computed:{

	},
	methods:{

	},
})
function getRoomList(){
	//mock up data
	return sampleRoomsList;
}
var sampleRoomsList = [{
	id: 1,
	name: 'sample room',
	playerNo: '3',
	status:'Running',
}]