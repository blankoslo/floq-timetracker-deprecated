var express = require('express');
var webpack = require('webpack');

if (process.env.NODE_ENV === 'production') {
  var app = express();
  app.get('/app.bundle.js', function (req, res) {
    res.sendFile('dist/js/app.bundle.js', {
      root: __dirname
    });
  }).listen(process.env.PORT || 8080, function (err) {
    if (err) { console.log(err) };
    console.log('Listening at localhost:8080');
  });
} else  {
  var config = require('./webpack.config');
  var WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), {
    hot: true
  }).listen(8080, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:8080');
  });
}
