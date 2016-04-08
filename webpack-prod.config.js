var webpack = require('webpack');

module.exports = {
  entry: [ './src/app/app.js' ],
  output: {
      path: __dirname + "/dist/js",
      filename: "app.bundle.js"
  },
  devtool: 'source-map',
  module: {
      preLoaders: [],
      loaders: [{
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/
      }, {
          test: /\.scss$/,
          loaders: ["style", "css", "sass"]
      }, {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
          loader: 'file'
      }, {
          test: /\.html$/,
          loader: 'raw'
      }]
  }
};
