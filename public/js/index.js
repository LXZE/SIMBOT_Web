var screenEnum={
	ROOMLIST:0,
	CREATEROOM:1,
}
Vue.component('room-list-pane',{
	template:Document.getElementById('roomListTemplate').innerHTML(),
})
var vm = new Vue({
	el: '#roomListPane',
	data:{
		currentView:screenEnum.ROOMLIST,
		rooms:[{
			id: 1,
			name: 'sample room',
			playerNo: '3',
			status:'Running',
		}]
	},
	computed:{

	},
	methods:{

	},
})