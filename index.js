var io_option = {
	transports: ['websocket'],
}

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));
app.use((req,res,next)=>{
	res.io = io;
	next();
})

app.get('/',(req,res)=>{
	res.sendFile('index.html');
});

io.of('/client').on('connect',(socket)=>{
	console.log('client bot connected')
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


server.listen(3000,()=>{
	console.log('socket listening at port 3000');
});

app.listen(8888,()=>{
	console.log('express listening at port 8888');
})