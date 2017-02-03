'use strict';
const Client = require('./Client');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var url = 'localhost:8888';
var name1 = 'LXZE_Debugger';
var token = 'BJNXBjeOg';
var room = 0;
var options = {};
var command = 'o';

var execute = (robot,callback)=>{
	console.log('IR = ',robot.IR,' smell = ',robot.smell);
	rl.question('move | turn -> ', (ans)=>{
		switch(ans){
			case 'move':
				rl.question('move amount = ',(ans2)=>{
					robot.move(parseInt(ans2));
					if(callback) callback();
				})
				break;
			case 'turn':
				rl.question('turn amount = ',(ans2)=>{
					robot.turn(parseInt(ans2));
					if(callback) callback();
				})
				break;
			default:
				if(callback) callback();
				break;
		}
	})
}

Client.connect(url,name1,token,room,execute);

