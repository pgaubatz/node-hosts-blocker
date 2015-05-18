'use strict';

var Promise = require('bluebird');
var byline = require('byline');

var HOST_REGEXP = /^\s*?(?:[a-f0-9\.:]+)\s+?([a-z0-9\._\-]+)\s*.*?$/i;

function matchHost(line) {
  var matches = HOST_REGEXP.exec(line);
  if (matches && matches.length === 2) {
    return matches[1];
  }
}

module.exports = function (readStream) {
  return Promise.resolve(readStream)
    .then(function (stream) {
      return new Promise(function (resolve, reject) {
        //if (!stream) {
        //  return resolve([]);
        //}
        var hosts = [];

        byline(stream)
          .on('data', function (line) {
            var match = matchHost(line);
            if (match) {
              hosts.push(match);
            }
          })
          .on('error', reject)
          .on('finish', function () {
            resolve(hosts);
          });
      });
    });
};
