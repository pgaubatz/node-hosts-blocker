'use strict';

var express = require('express');

var ssePusher = require('./sse-pusher');

module.exports = function (blockingLogger) {
  var pushBlocking = ssePusher();

  blockingLogger.on('block', function (data) {
    pushBlocking(JSON.stringify(data));
  });

  var router = express.Router();

  router.get('/api/live/blocks', pushBlocking.handler());

  return router;
};
