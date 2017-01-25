'use strict';
const Client = require('./Client');

var url = 'localhost:8888';
var name1 = 'LXZE1'
var token = ''
var room = 0;
var options = {};

var execute = (robot)=>{
	console.log(robot.IR, robot.smell);
	robot.move(Math.random()*10);
	robot.turn((Math.random()*360)-180);
}

Client.connect(url,name1,token,room,execute);

