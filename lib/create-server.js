'use strict';

var http = require('http');

module.exports = function (ip) {
  var server = http.createServer(function (_, res) {
    res.writeHead(204, {'Cache-Control': 'max-age=31556926'});
    res.end();
  });

  server.listen(80, ip || undefined);

  return server;
};
