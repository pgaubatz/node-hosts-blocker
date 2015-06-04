'use strict';

var express = require('express');

var ssePusher = require('./sse-pusher');

module.exports = function (blockingLogger) {
  var pushEvent = ssePusher();

  blockingLogger.on('block', function (data) {
    pushEvent('block', data);
  });

  var router = express.Router();

  router.get('/api/live/events', pushEvent.handler());

  return router;
};
