import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
// import * as WebSocket from "ws";
import * as uid from "shortid";
import { SV } from './index';
import { Room } from './Room';
import * as util from 'util';
import * as njk from 'nunjucks';

// TODO : Delete all webpack component when in production
import * as webpack from 'webpack';
let webpackConfig = {
  cache: true,
  watch: true,
  devtool: 'eval',
  entry: [
  	'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './front/main.js'],
  output: {
    path: '/',
    publicPath: 'http://localhost:8888',
    filename: 'app/app.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
        }
      }
    ]
  },
  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
};
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
let compiler = webpack(webpackConfig);

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
		this.express.use(express.static('public'));
		njk.configure('views',{
			autoescape:true,
			express:this.express,
		});

		// TODO : Delete all webpack component when in production
		this.express.use(webpackDevMiddleware(compiler,{
    		publicPath: webpackConfig.output.publicPath,  stats: {colors: true}
		}));
		this.express.use(webpackHotMiddleware(compiler,{
			log: console.log
		}));
	}
	private routes(): void {
		let router = express.Router();
		router.get('/', (req, res, next) => {
			res.render('index.html');
		});

		router.get('/watch',(req,res)=>{
			res.json({a:1});
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