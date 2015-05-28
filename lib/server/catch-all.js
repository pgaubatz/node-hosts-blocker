'use strict';

function extract(req) {
  return {
    time: Date.now(),
    method: req.method,
    host: req.headers.host,
    path: req.url,
    client: req.ip || (req.connection && req.connection.remoteAddress),
    userAgent: req.headers['user-agent']
  };
}

module.exports = function (blockingLogger, uiHostname) {
  return function (req, res, next) {
    if (req.hostname === uiHostname) {
      return next();
    }

    blockingLogger.emit('block', extract(req));

    res.status(204).end();
  };
};
