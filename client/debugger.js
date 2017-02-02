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

var execute = (robot)=>{
	console.log('IR = ',robot.IR,' smell = ',robot.smell);
	// rl.question('move | turn', (ans)=>{
	// 	switch(ans){
	// 		case 'move':
	// 			rl.question('move amount = ',(ans2)=>{
	// 				robot.move(parseInt(ans2));
	// 			})
	// 			break;
	// 		case 'turn':
	// 			rl.question('turn amount = ',(ans2)=>{
	// 				robot.turn(parseInt(ans2));
	// 			})
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// })
	switch(command)
	{
		case 'w':
			robot.move(5);
			break;
		case 'a':
			robot.turn(-5);
			break;
		case 's':
			robot.move(-5);
			break;
		case 'd':
			robot.turn(5);
			break;
		default:
			robot.move(0);
	}
	command = 'o';
}

rl.on('line',(input)=>{
	console.log(input);
	switch(input.trim()){
		case 'w':
			command = 'w';
			break;
		case 'a':
			command = 'a';
			break;
		case 's':
			command = 's';
			break;
		case 'd':
			command = 'd';
			break;
	}
})

Client.connect(url,name1,token,room,execute);

