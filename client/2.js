'use strict';
const Client = require('./Client');

var url = 'localhost:8888';
var name1 = 'LXZE2'
var token = ''
var room = 0;
var options = {};

var execute = (robot)=>{
	console.log('IR = ',robot.IR,' smell = ',robot.smell);
	robot.turn(-1);
	robot.move(-1);
}

Client.connect(url,name1,token,room,execute);

