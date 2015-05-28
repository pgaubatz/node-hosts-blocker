'use strict';

var path = require('path');
var EventEmitter = require('events').EventEmitter;

var express = require('express');

var catchAll = require('./catch-all');
var api = require('./api');

module.exports = function (ip, uiHostname) {
  var blockingLogger = new EventEmitter();
  var app = express();

  app.use(catchAll(blockingLogger, uiHostname));
  app.use(api(blockingLogger));
  app.use(express.static(path.join(__dirname, '/public')));

  return app.listen(80, ip);
};
