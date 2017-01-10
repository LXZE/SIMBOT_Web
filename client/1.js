'use strict';
const Client = require('./Client');

var url = 'localhost:8888';
var name1 = 'LXZE1'
var token = ''
var room = 0;
var options = {};

var execute = (robot)=>{
	robot.move(1);
	robot.turn(1);
}

Client.connect(url,name1,token,room,execute);

