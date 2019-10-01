const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {
	mode: 'development',
	entry: {
		app: ['./front/index.js']
	},
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		port: 8888,
		host: `0.0.0.0`,
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/js/',
		filename: 'bundle.js'
	},
	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.pug$/,
				loader: 'pug-plain-loader'
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		},
		extensions: [
			'.js',
			'.vue'
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
}

module.exports = config;
