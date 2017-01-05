import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
// import * as WebSocket from "ws";
import * as uid from "shortid";
import { SV } from './index';

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

		router.get('/roomList',(req,res)=>{		
			res.json(SV.getRoomList())
		});

		router.post('/create',(req,res)=>{
			var roomName = req.body.roomName || 'Untitled';
			var options = {
				max_player_number: req.body.max_player_number || 10,
				player_robot_number: req.body.player_robot_number || 1,
			}
			var roomData = SV.createRoom(roomName,options);
			res.json(roomData);
		});

		router.get('/info/:roomID',(req,res)=>{
			res.json(SV.getRoomInfo(req.params.roomID));
		});
		router.get('/start/:roomID',(req,res)=>{

		});
		router.get('/stop/:roomID',(req,res)=>{

		});
		router.delete('/:roomID',(req,res)=>{

		});
		this.express.use('/', router);
	}

}
export default new App().express;