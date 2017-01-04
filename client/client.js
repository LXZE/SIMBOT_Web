var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8888/');

ws.on('open', function open() {
	console.log('Connect to server successfully')
	ws.send('Connection requested from client 1');
});

ws.on('message', function(data, flags) {
	console.log(data);
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
});


ws.on('disconnect',()=>{
	console.log('disconnect from server');
})


// var socket = require('socket.io-client')('http://localhost:3000/client');
// var room_id = ''
// socket.on('connect',()=>{
// 	console.log('Connected to server')
// 	socket.emit('join_room',room_id);
// });

// socket.on('client_msg',(msg)=>{
// 	console.log(msg)
// })

// socket.on('connect_error',(err)=>{
// 	console.log(err)
// })

// socket.on('disconnect',()=>{
// 	// socket.emit('leave_room',room_id);
// 	console.log('Disconnect from server')
// });