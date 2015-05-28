'use strict';

module.exports = function () {
  var id = 0;
  var listener = [];

  function fn(data) {
    listener.forEach(function (res) {
      res.write('id: ' + (id++) + '\n');
      res.write('data: ' + data + '\n\n');
    });
  }

  fn.handler = function () {
    return function (req, res) {
      req.socket.setTimeout(Infinity);

      res.statusCode = 200;

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      listener.push(res);
    };
  };

  return fn;
};
