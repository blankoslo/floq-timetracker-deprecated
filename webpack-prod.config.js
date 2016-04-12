var webpack = require('webpack');

module.exports = {
  entry: [ './src/app/app.js' ],
  output: {
      path: __dirname + "/dist/js",
      filename: "app.bundle.js"
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: false,
      compress: {
        warnings: false
      }
    })
  ],
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
