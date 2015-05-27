'use strict';

var http = require('http');

function createRequestLogEntry(req) {
  return {
    method: req.method,
    host: req.headers.host,
    path: req.url,
    client: req.ip || (req.connection && req.connection.remoteAddress),
    userAgent: req.headers['user-agent']
  };
}

module.exports = function (ip) {
  var server = http.createServer(function (req, res) {
    console.log(createRequestLogEntry(req));
    res.writeHead(204);
    res.end();
  });

  server.listen(80, ip || undefined);

  return server;
};
