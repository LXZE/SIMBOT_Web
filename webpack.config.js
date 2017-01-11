var webpack = require('webpack')

module.exports = {
  cache: true,
  watch: true,
  devtool: 'source-map',
  entry: ['webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './front/main.js'],
  output: {
    path: '/public',
    publicPath: 'http://localhost:8888/',
    filename: 'app.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
};
