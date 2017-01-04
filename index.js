'use strict';
const express = require("express");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = express();
    }
}
