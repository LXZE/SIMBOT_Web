var express = require('express');
var app = express();
var io_server = require('http').Server(app);
var io = require('socket.io')(io_server);
var body_parser = require('body-parser');

app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())
app.use(express.static('public'));
app.use((req,res,next)=>{
	res.io = io;
	next();
})

app.get('/',(req,res)=>{
	res.sendFile('index.html');
});

app.get('/watch',(req,res)=>{
	res.sendFile('watch.html');
});

io.of('/client')
.on('connect',(socket)=>{
	console.log('client bot connected');
	socket.on('disconnect',()=>{
		console.log('client bot disconnected')
	});
});

io.of('/view')
.on('connection',(socket)=>{
	console.log('user connected');
	socket.on('disconnect',()=>{
		console.log('user disconnected')
	});
});


app.use('/room',require('./room'));


io_server.listen(3000,()=>{
	console.log('socket listening at port 3000');
});

app.listen(8888,()=>{
	console.log('express listening at port 8888');
})