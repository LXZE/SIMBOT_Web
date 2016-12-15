var express = require('express');
var router = express.Router()
var body_parser = require('body-parser');
const uid = require('shortid');
var _ = require('underscore');

var rooms = [];

router.use((req,res,next)=>{
	next();
});

router.post('/create',(req,res)=>{
	var room_name = req.body.room_name || 'Untitled';
	var max_player_number = req.body.max_player_number || 10;
	var player_robot_number = req.body.player_robot_number || 1;
	var room_id = uid.generate();
	var room_data = {
		room_name: 			room_name,
		max_player_number:	max_player_number,
		player_robot_number:player_robot_number,
		room_id:			room_id,
	}
	rooms.push(room_data);

	// create socket

	res.json(room_data);
})

router.get('/',(req,res)=>{
	res.json(rooms);
})

router.get('/:room_id',(req,res)=>{
	var find_room = _.find(rooms,(obj)=>{ return obj.room_id == req.params.room_id });
	if(find_room){
		res.json(find_room);
	}
	else{
		res.status(404).send('Room not found')
	}
});


router.get('/start',(req,res)=>{

});

router.get('/stop',(req,res)=>{

});



router.delete('/:room_id',(req,res)=>{

	var find_room = _.find(rooms,(obj)=>{ return obj.room_id == req.params.room_id });
	if(!find_room){
		res.status(404).send('Room not found')
	}

	// close socket

	// delete from rooms
	rooms = rooms.filter((obj)=>{
		return obj.room_id != req.params.room_id;
	})
	res.send('Delete successfully')

});

module.exports = router;