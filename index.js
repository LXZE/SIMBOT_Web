require('dotenv').config()
const path = require('path')
process.env.node_path = path.resolve(__dirname)
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


const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const devServerEnabled = process.env.NODE_ENV == 'dev'

if (devServerEnabled) {
	console.log("Dev mode enabled")
	config.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');
	config.plugins.push(new webpack.HotModuleReplacementPlugin());

	const compiler = webpack(config);
	clientServerApp.app.use(webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath
	}))
	clientServerApp.app.use(webpackHotMiddleware(compiler))
}

