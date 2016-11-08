var path = require('path')
,   webpack = require('webpack')

module.exports = {
  entry: {
    hbs: './client_side/src/js/main_hbs.js',
    redux: './client_side/src/js/main_redux.js'
  },
  debug: true,
  output: {
    path: './client_side/dist/js',
    filename: 'redux.bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("hbs", "hbs.bundle.js")
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        plugins: ['transform-object-rest-spread']
      }
    }]
  }
};
