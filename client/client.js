var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8888/');
var msgpack = require("msgpack-lite");
var Sign = require('../dist/Sign').Sign;

var async = require('async');
var request = require('supertest');

var clientName = 'LXZE';
var clientID = '';
var clientToken = 'Sy9OTznHg';
var roomID = '0';
var msgOptions = {binary: true};
var status = '';

var disconn = ()=>{
	ws.close();
}
var encode = (data)=>{
	return msgpack.encode(data);
}

var leaving = ()=>{
	ws.send(encode([Sign.CLIENT_LEAVE,null,null]));
	disconn();
}

ws.on('open', function open() {
	console.log('Connect to server successfully, now Authen with name and token');

	async.series([
		function(cb){
			// Send Name
			var message = encode([Sign.CLIENT_NAME,clientName,`Client ${clientName} connected to server`])
			ws.send(message,msgOptions);
			cb(null,null);
		},
		function(cb){
			// TODO : delete this after create test
			// create room
			request('http://localhost:8888').post('/create').end((err,res)=>{
				let data = res.body;
				clientToken = data.options.roomToken;
				roomID = data.roomID;
				cb(null,null);
			});
		},
		function(cb){
			// Send Token
			message = encode([Sign.CLIENT_TOKEN,clientToken,`Client ${clientName} authen with token`])
			ws.send(message,msgOptions);
			console.log('Authen Success');
			cb(null,null);

		},
		function(cb){
			// join room
			message = encode([Sign.CLIENT_JOIN,roomID,`Client ${clientName} join room ID ${roomID}`]);
			ws.send(message,msgOptions);
			console.log('Sending join request');
			cb(null,null);
		}

		])

});

ws.on('message', function(message, flags) {
	let data = msgpack.decode(message);
	switch(data[0]){
		case Sign.CLIENT_ID:
			clientID = data[1];
			break;
		case Sign.CLIENT_ERR:
			console.error(data[1]);
			disconn();
			break;
		case Sign.CLIENT_WAIT:
			console.log('Waiting room to start');
			status = 'waiting';
			break;
		case Sign.ROOM_LEAVE:
			disconn();
			break;
		case Sign.ROOM_DATA:
			console.log(data[1]);
			break;
		default:
			console.log(data[2])
			break;
	}
});

ws.on('disconnect',()=>{
	console.log('Disconnected from server');
})

ws.on('close',()=>{
	console.log('Disconnected from server');
})

process.on('SIGINT', () => {
  console.log(`About to exit`);
  if(status == 'waiting')
  	leaving();
  else
  	disconn();
});