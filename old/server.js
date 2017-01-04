import { EventEmitter } from "events";

export class Server extends EventEmitter {
	constructor(){
		super();
		this.clients = {};
	}	

	register(){

	}


}