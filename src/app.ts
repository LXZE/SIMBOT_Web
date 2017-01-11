import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
// import * as WebSocket from "ws";
import * as uid from "shortid";
import { SV } from './index';
import { Room } from './Room';
import * as util from 'util';
import * as njk from 'nunjucks';

class App {
	public express: express.Application;

	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
	}
	private middleware(): void {
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
		this.express.use(express.static('public'))
		// this.express.use('view engine',)
		njk.configure('views',{
			autoescape:true,
			express:this.express,
		})
	}
	private routes(): void {
		let router = express.Router();
		router.get('/', (req, res, next) => {
			// res.sendFile('index.html');
			res.render('index.html',{message:'Hello world'});
		});

		router.get('/watch',(req,res)=>{
			res.sendFile('watch.html');
		});

		router.get('/room',(req,res)=>{
			res.json(SV.getRoomList())
		});

		router.get('/room/:roomID',(req,res)=>{
			let roomInfo:Room<any> = SV.getRoomInfo(req.params.roomID);
			if(roomInfo)
				res.json({clientAmount: roomInfo.getClientAmount(),options: roomInfo.options,lock: roomInfo.getCurrentLock()});
			else
				res.status(404).send(`Room ${req.params.roomID} not found`)
		});

		router.post('/create',(req,res)=>{
			var roomName = req.body.roomName || 'Untitled';
			var options = {
				maxPlayer: req.body.maxPlayer || 10,
				robotPerPlayer: req.body.robotPerPlayer || 2,
			}
			var roomData = SV.createRoom(roomName,options);
			res.json(roomData);
		});

		router.get('/start/:roomID',(req,res)=>{
			SV.startRoom(req.params.roomID,(err,pass)=>{
				if(pass){
					res.json({'success':true});
				}else{
					res.json({'success':false,'error':err});
				}
			});
		});
		router.get('/stop/:roomID',(req,res)=>{
			SV.stopRoom(req.params.roomID,(err,pass)=>{
				if(pass){
					res.json({'success':true});
				}else{
					res.json({'success':false,'error':err});
				}
			});
		});
		router.get('/pause/:roomID',(req,res)=>{
			SV.pauseRoom(req.params.roomID,(err,pass)=>{
				if(pass){
					res.json({'success':true});
				}else{
					res.json({'success':false,'error':err});
				}
			});
		});
		router.get('/resume/:roomID',(req,res)=>{
			SV.resumeRoom(req.params.roomID,(err,pass)=>{
				if(pass){
					res.json({'success':true});
				}else{
					res.json({'success':false,'error':err});
				}
			});
		});
		router.delete('/:roomID',(req,res)=>{
			SV.deleteRoom(req.params.roomID);
			res.json({'success':true});
		});
		this.express.use('/', router);
	}
}
export default new App().express;