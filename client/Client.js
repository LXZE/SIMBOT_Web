const WebSocket = require('ws');
const EventEmiiter = require("events");
var ws;
var ev;

const msgpack = require("msgpack-lite");
const Sign = require('../dist/Sign').Sign;
const async = require('async');
const request = require('supertest');
const util = require('util');

var clientName = 'LXZE';
var clientID = '';
var clientToken = '';
var roomID = '0';
var msgOptions = {binary: true};
var status = '';
var execute = (robot)=>{ robot.move(Math.random()*10); };
var cmdList = {};
var cmdType = Sign.CONTINUE_MOTION;

var connect = (url,name,token,room,overrideExecute)=>{
	ws = new WebSocket(`ws://${url}/`);
	ev = new EventEmiiter();
	clientName = name;
	clientToken = token;
	roomID = room;
	execute = overrideExecute;
	define();
}

var run = (data)=>{
	let i = 0;
	let step;
	data.forEach((elem)=>{
		let robot = new Robot(i++,elem);
		step = elem.step;
		execute(robot);
	})
	send(cmdList,step);
}

class Robot {
	constructor(id,data){
		this.cmdRank = 0;
		this.id = id;
		this.IR = data.robot.IR;
		this.smell = data.robot.smell;
		this.ownerID = data.robot.ownerID;
		this.robotID = data.robot.robotID;
		cmdList[data.robot.robotID] = {};
	}
	move(val){
		console.log(`mv ${val} [${this.cmdRank++}]`)
		cmdType = Sign.CONTINUE_MOTION;
		if(!cmdList[this.robotID].hasOwnProperty('move')){
			Object.assign(cmdList[this.robotID],{move:val});
		}
	}
	turn(deg){
		console.log(`tr ${deg} [${this.cmdRank++}]`)
		cmdType = Sign.CONTINUE_MOTION;
		if(!cmdList[this.robotID].hasOwnProperty('turn')){
			Object.assign(cmdList[this.robotID],{turn:deg});
		}
	}	
}

var send = (data,step)=>{
	console.log(`Step ${step} data = ${util.inspect(data)}`);
	// TODO : remove timeout in production or reduce time
	var time = 0.9;
	setTimeout(()=>{
		try{
			ws.send(msgpack.encode([Sign.CLIENT_DATA,{type:cmdType, step:step, command:data
					},`User ${clientName}[${clientID}] send data`]),msgOptions);
			cmdList = {};
		}catch(e){}
	},time*1000);
}

var moveForward = ()=>{
	cmdType = Sign.DISCRETE_MOTION;
}
var moveBackward = ()=>{
	cmdType = Sign.DISCRETE_MOTION;
}
var turnLeft = ()=>{
	cmdType = Sign.DISCRETE_MOTION;
}
var turnRight = ()=>{
	cmdType = Sign.DISCRETE_MOTION;
}

var define = ()=>{
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
					cb(null,null);
				});
			},
			function(cb){
				// TODO : delete this after create test
				// request room token
				request('http://localhost:8888').get(`/room/${roomID}`).end((err,res)=>{
					let data = res.body;
					clientToken = data.options.roomToken;
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
				status = 'running';
				run(data[1]);
				break;
			default:
				ev.emit('info',data[2]);
				console.log(data[2])
				break;
		}
	});

	ws.on('disconnect',()=>{
		console.log('Disconnected from server');
	});

	ws.on('close',()=>{
		console.log('Disconnected from server');
	});
}

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

process.on('SIGINT', () => {
  console.log(`About to exit`);
  if(status == 'waiting')
  	leaving();
  else
  	disconn();
});

module.exports = {
	connect:connect,
}