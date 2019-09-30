const express = require('express')
const app = express()
const db = require('./db')
const portNumber = 8888
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('static'))
app.use(express.static('dist'))

app.get('/logout', (req, res)=>{

})

app.get('/login', (req, res)=>{

})

app.post('/login', (req, res)=>{

})

app.get('/', (req, res)=>{
	res.sendFile('static/index.html')
})

app.listen(portNumber, ()=>{
	console.log(`Web server for client is listening to port ${portNumber}`)
})


exports.app = app
