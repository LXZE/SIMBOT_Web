var socket = require('socket.io-client')('http://localhost:3000/client');

socket.on('connect',()=>{
	console.log('Connected to server')
});

socket.on('connect_error',(err)=>{
	console.log(err)
})


socket.on('disconnect',()=>{
	console.log('Disconnect from server')
});