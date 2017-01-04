'use strict';
const http = require("http");
const app_1 = require("./app");
const Server_1 = require("./Server");
const port = 8888;
app_1.default.set('port', port);
const httpServer = http.createServer(app_1.default);
const botServer = new Server_1.Server({ server: httpServer });
httpServer.listen(port);
console.log(`Server listening on http://localhost:${port}`);
