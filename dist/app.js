"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const index_1 = require("./index");
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(express.static('public'));
    }
    routes() {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.sendFile('index.html');
        });
        router.get('/watch', (req, res) => {
            res.sendFile('watch.html');
        });
        router.get('/roomList', (req, res) => {
            res.json(index_1.SV.getRoomList());
        });
        router.post('/create', (req, res) => {
            var roomName = req.body.roomName || 'Untitled';
            var options = {
                max_player_number: req.body.max_player_number || 10,
                player_robot_number: req.body.player_robot_number || 1,
                player_number: 0,
            };
            var roomData = index_1.SV.createRoom(roomName, options);
            res.json(roomData);
        });
        this.express.use('/', router);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new App().express;
