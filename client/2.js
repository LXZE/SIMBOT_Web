'use strict';
const Client = require('./Client');

var url = 'localhost:8888';
var name1 = 'LXZE2'
var token = ''
var room = 0;
var options = {};

Client.connect(url,name1,token,room,(ws,ev)=>{
	ev.on('data',(data)=>{
		console.log('data from server: ',data);
		let dumpData = []
		data.forEach((elem)=>{
			// elem.robot.x
			dumpData.push({move:1,turn:1})
		})
		setTimeout(()=>{
			Client.move(data[0].step,dumpData);
		},500);
	})

	ev.on('info',(info)=>{
		console.log('info from server: '.info);
	})
});