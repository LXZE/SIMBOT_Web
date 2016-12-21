var screenEnum={
	ROOMLIST:0,
	CREATEROOM:1,
}
var vm = new Vue({
	el: '#roomList',
	data:{
		currentView:screenEnum.ROOMLIST,
		rooms:[
			{
				id: 1,
				name: 'sample room',
				playerNo: '3',
				status:'Running',
			},
			{
				id: 2,
				name: 'second room',
				playerNo: '2',
				status:'Waiting for Player',
			}
		],
	},
	computed:{

	},
	methods:{

	},
})