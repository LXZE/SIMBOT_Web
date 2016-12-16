var socket = require('socket.io-client')('http://localhost:3000/client');


var room_id = 'r1LZU3lNg'

socket.on('connect',()=>{
	console.log('Connected to server')
	socket.emit('join_room',room_id);
});

socket.on('client_msg',(msg)=>{
	console.log(msg)
})

socket.on('connect_error',(err)=>{
	console.log(err)
})

socket.on('disconnect',()=>{
	socket.emit('leave_room',room_id);
	console.log('Disconnect from server')
});