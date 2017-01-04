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
export type Client = WebSocket & { id: string };