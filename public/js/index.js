var screenEnum={
	ROOMLIST:0,
	CREATEROOM:1,
}
var vm = new Vue({
	el: '#app',
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