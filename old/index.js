'use strict';
var express = require('express');
var app = express();
var io_server = require('http').Server(app);
var io = require('socket.io')(io_server);
var body_parser = require('body-parser');
var _ = require('underscore');
var amqp = require('amqp');
var conn = amqp.createConnection({url: "amqp://guest:guest@localhost:3001"});

export { Server } from './server';
export { Room } from './room';


app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())
app.use(express.static('public'));
app.use((req,res,next)=>{
	// req.io = io;
	next();
})

app.get('/',(req,res)=>{
	res.sendFile('index.html');
});

app.get('/watch',(req,res)=>{
	res.sendFile('watch.html');
});

conn.on('error', (e)=>{
	console.log("Error from amqp: ", e);
});

conn.on('ready', ()=>{
	console.log('MQ is ready.');
})

exports.io = ()=>{
	return io;
}

// io.of('/client')
// .on('connect',(socket)=>{
// 	// console.log('client bot connected');

// 	// define on connect ( join room )

// 	// define run in each epoch

// 	// define on disconnect ( leave room )

// 	socket.on('join_room',(room_id)=>{
// 		var room = Room.findRoom(room_id);
// 		if(!room || Room.checkStart(room_id)){
// 			socket.emit('disconnect')
// 			// return;
// 		}else{
// 			console.log('client join room '+room_id);
// 			var idx = _.findIndex(Room.rooms,(obj)=>{ return obj.room_id == room_id })
// 			socket.join(room_id);
// 			Room.rooms[idx]['player_number']+=1;
// 		}
// 	});

// 	socket.on('disconnect',()=>{
// 		console.log('client bot disconnected')
// 	});
// });

// io.of('/view')
// .on('connect',(socket)=>{
// 	console.log('user connected');
// 	socket.on('disconnect',()=>{
// 		console.log('user disconnected')
// 	});
// });


// var Room = require('./room');
// app.use('/room',Room['router']);


io_server.listen(3000,()=>{
	console.log('socket listening at port 3000');
});

app.listen(8888,()=>{
	console.log('express listening at port 8888');
});

