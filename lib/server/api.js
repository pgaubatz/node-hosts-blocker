'use strict';

var express = require('express');
var ssePusher = require('sse-pusher');

module.exports = function (blockingLogger) {
  var push = ssePusher();

  blockingLogger.on('block', function (data) {
    push('block', data);
  });

  var router = express.Router();

  router.get('/api/live/events', push.handler());

  return router;
};
