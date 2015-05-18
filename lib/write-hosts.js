'use strict';

var Promise = require('bluebird');

var DEFAULT_DESTINATION_IP = '0.0.0.0';
var EOL = '\n';
var SEPARATOR = '\t';

module.exports = function (hosts, writer, destinationIP) {
  destinationIP = destinationIP || DEFAULT_DESTINATION_IP;

  return new Promise(function (resolve, reject) {
    var length = hosts.length;
    var i = 0;

    writer.on('error', reject);

    (function write(done) {
      var ok = true;
      var line;

      for (; ok && i < length; i++) {
        line = destinationIP + SEPARATOR + hosts[i] + EOL;
        ok = writer.write(line, 'utf8', (i === length - 1) ? done : null);
      }

      // had to stop early, write some more once it drains:
      writer.once('drain', write);
    })(resolve);
  });
};
