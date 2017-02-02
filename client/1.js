'use strict';
const Client = require('./Client');

var url = 'localhost:8888';
var name1 = 'LXZE1'
var token = ''
var room = 0;
var options = {};

var execute = (robot)=>{
	console.log('IR = ',robot.IR,' smell = ',robot.smell);
	switch(Math.floor(Math.random()*3)){
		case 0:
			robot.move(Math.random()*50);
			break;
		case 1:
			robot.turn((Math.random()*360)-180);
			break;
		default:
			break;
	}
}

Client.connect(url,name1,token,room,execute);

