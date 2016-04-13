const express = require('express');
const webpack = require('webpack');

const port = process.env.PORT || 8080

if (process.env.NODE_ENV === 'production') {
  var app = express();
  app.get('/app.bundle.js', function (req, res) {
    res.sendFile('dist/js/app.bundle.js', {
      root: __dirname
    });
  }).get('/app.bundle.js.map', function (req, res) {
    res.sendFile('dist/js/app.bundle.js.map', {
      root: __dirname
    });
  }).listen(port, function (err) {
    if (err) { console.log(err) };
    console.log(`Listening at localhost:${port}`);
  });
} else  {
  var config = require('./webpack.config');
  var WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), {
    hot: true
  }).listen(port, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log(`Listening at localhost:${port}`);
  });
}
