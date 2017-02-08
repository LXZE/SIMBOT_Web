'use strict';
import * as http from 'http';
import * as WebSocket from "ws";
import App from './app';
import { Server } from './Server';

const port = 8888;
App.set('port',port);
const httpServer = http.createServer(App);
const botServer = new Server({ server: httpServer });
httpServer.listen(port);
console.log(`Server listening on http://localhost:${port}`);
export type Client = WebSocket & { id: string, data: any };
export let SV = botServer;

[
 [ 'info' , '\x1b[34m' ],
 [ 'error', '\x1b[31m' ],
 [ 'log'  , '\x1b[2m'  ]
].forEach(function(pair) {
  var method = pair[0], reset = '\x1b[0m', color = '\x1b[36m' + pair[1];
  console[method] = console[method].bind(console, color, method.toUpperCase(), reset);
});