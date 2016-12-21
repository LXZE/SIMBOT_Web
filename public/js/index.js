var screenEnum={
	ROOMLIST:0,
	CREATEROOM:1,
}
function getRoomList(){
	//mock up data
	return sampleRoomsList;
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

var sampleRoomsList = [{
	id: 1,
	name: 'sample room',
	playerNo: '3',
	status:'Running',
}]