require('dotenv').config()
const path = require('path')
process.env['node_path'] = path.resolve(__dirname)
const clientServerApp = require('./back/clientServer')
let logList = [
	[ 'info' , '\x1b[34m' ],
	[ 'error', '\x1b[31m' ],
	[ 'log'  , '\x1b[2m'  ]
]
logList.forEach((pair) => {
	var method = pair[0], reset = '\x1b[0m', color = '\x1b[36m' + pair[1];
	console[method] = console[method].bind(console, color, method.toUpperCase(), reset);
});
