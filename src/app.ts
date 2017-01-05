import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
// import * as WebSocket from "ws";
import * as uid from "shortid";
import { SV } from './index';
import * as util from 'util';

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
	}
	private routes(): void {
		let router = express.Router();
		router.get('/', (req, res, next) => {
			res.sendFile('index.html');
		});

		router.get('/watch',(req,res)=>{
			res.sendFile('watch.html');
		});

		router.get('/room',(req,res)=>{
			res.json(SV.getRoomList())
		});

		router.get('/room/:roomID',(req,res)=>{
			let roomInfo = SV.getRoomInfo(req.params.roomID);
			res.send(				
					util.inspect(
						roomInfo
						,false,null
					)

			);

		});

		router.post('/create',(req,res)=>{
			var roomName = req.body.roomName || 'Untitled';
			var options = {
				maxPlayer: req.body.maxPlayer || 10,
				robotPerPlayer: req.body.robotPerPlayer || 1,
			}
			var roomData = SV.createRoom(roomName,options);
			res.json(roomData);
		});

		router.get('/start/:roomID',(req,res)=>{

		});
		router.get('/stop/:roomID',(req,res)=>{

		});
		router.delete('/:roomID',(req,res)=>{
			SV.deleteRoom(req.params.roomID);
			res.json({'success':true});
		});
		this.express.use('/', router);
	}

}
export default new App().express;