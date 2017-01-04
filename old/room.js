var express = require('express');
var router = express.Router()
var body_parser = require('body-parser');
const uid = require('shortid');
var _ = require('underscore');
// const EventEmitter = require('events');
// class MyEmitter extends EventEmitter {}
// const ev = new MyEmitter();
import { EventEmitter } from "events";
import 

export class Room extends EventEmitter { 
	constructor(options){
		super();
		this.roomID = options.roomID;
		this.roomName = options.roomName;
		this.maxPlayerNumber = options.maxPlayerNumber;
		this.lock = false
		this.state = 'unlock';

	}

	requestJoin(){
		return !this.lock
	}

	broadcast(){

	}

	lock(){
		this.emit('lock');
		this.lock = true;
	}

	unlock(){
		this.emit('unlock');
		this.lock = false;
	}

	onJoin(client){
		if(this.requestJoin())
			this.clients.push(client);

		// confirm roomID
		// client.send('');


	}

	onConnect(){

	}

	onMessage(){

	}

	onLeave(){

	}
}
/*
var rooms = [];
var findRoom = (room_id)=>{
	return _.find(rooms,(obj)=>{ return obj.room_id == room_id })
}
var checkStart = (room_id)=>{
	var room = findRoom(room_id);
	return room ? room.room_start : false;
}


router.use((req,res,next)=>{
	next();
});

router.post('/create',(req,res)=>{
	var room_name = req.body.room_name || 'Untitled';
	var max_player_number = req.body.max_player_number || 10;
	var player_robot_number = req.body.player_robot_number || 1;
	var room_id = uid.generate();

	var player_number = 0;
	var room_start = false;
	
	var room_data = {
		room_name: 				room_name,
		max_player_number:		max_player_number,
		player_robot_number: 	player_robot_number,
		room_id:				room_id,
		room_start: 			room_start,
		player_number: 			player_number,
	}
	rooms.push(room_data);
	res.json(room_data);
})

router.get('/',(req,res)=>{
	res.json(rooms);
})

router.get('/:room_id',(req,res)=>{
	var find_room = findRoom(req.params.room_id);
	if(find_room){
		res.json(find_room);
	}
	else{
		res.status(404).send('Room not found')
	}
});


router.get('/start/:room_id',(req,res)=>{

	var room_id = req.params.room_id;
	var find_room = findRoom(room_id);
	if(!find_room){
		res.status(404).send('Room not found')
		return;
	}
	console.log(req.io);
	req.io.of('/client').in(room_id).emit('client_msg','client start');
	req.io.in(room_id).emit('viewer_msg','client start');
	console.log('start room '+room_id)
	res.send('room started')
});

router.get('/stop/:room_id',(req,res)=>{

	var room_id = req.params.room_id;
	var find_room = findRoom(room_id);
	if(!find_room){
		res.status(404).send('Room not found')
		return;
	}

	req.io.of('/client').in(room_id).emit('client_msg','client stop');
	req.io.in(room_id).emit('viewer_msg','client stop');
	console.log('stop room '+room_id)
	res.send('room stopped')
});

router.delete('/:room_id',(req,res)=>{
	var find_room = findRoom(req.params.room_id);
	if(!find_room){
		res.status(404).send('Room not found')
		return;
	}
	// delete from rooms
	rooms = rooms.filter((obj)=>{
		return obj.room_id != req.params.room_id;
	})
	res.send('Delete successfully')
});

// ev.on('start',()=>{

// });

// ev.on('run',()=>{

// })

// ev.on('stop',()=>{

// });

module.exports = {
	rooms: rooms,
	findRoom: findRoom,
	checkStart: checkStart,
	router: router,
};
*/

