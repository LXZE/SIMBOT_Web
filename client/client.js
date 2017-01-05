var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8888/');
var msgpack = require("msgpack-lite");
var Sign = require('../dist/Sign');

var clientName = 'LXZE_ZAA123';
var clientID = '';
var clientToken = 'Skq9c3iBl';
var msgOptions = {binary: true};

ws.on('open', function open() {
	console.log('Connect to server successfully, now Authen with name and token');

	// Send Name
	var message = msgpack.encode([2,clientName,`Client ${clientName} connected to server`])
	ws.send(message,msgOptions);
	
	// Send Token
	message = msgpack.encode([3,clientToken,`Client ${clientName} authen with token`])
	ws.send(message,msgOptions);
	console.log('Authen Success');
});

ws.on('message', function(message, flags) {
	let data = msgpack.decode(message);
	console.log(data);
	switch(data[0]){
		case 1:
			clientID = data[1]
			console.log(data[2])
			break;
		default:
			break;
	}
});

var disconn = function(){
	ws.close();
}
ws.on('disconnect',()=>{
	console.log('Disconnected from server');
})

ws.on('close',()=>{
	console.log('Disconnected from server');
})

process.on('SIGINT', () => {
  console.log(`About to exit`);
  disconn();
});