import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as WebSocket from "ws";
import * as uid from "shortid";


// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(express.static('public'))
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();
    router.get('/', (req, res, next) => {
      res.sendFile('index.html');
    });
    router.get('/watch',(req,res)=>{
      res.sendFile('watch.html');
    });

    this.express.use('/', router);
  }

}
export default new App().express;
export type Client = WebSocket & { id: string };