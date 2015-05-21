'use strict';

var request = require('request');
var Promise = require('bluebird');

var extract = require('./extract');

module.exports = function (url) {
  return new Promise(function (resolve, reject) {
    var stream = request.get(url);

    stream.on('error', reject);
    stream.on('response', function (res) {
      if (res.statusCode !== 200) {
        return reject(new Error(
          'Resource ' + url +
          ' is not available (HTTP ' + res.statusCode + ')'
        ));
      }

      var type = res.headers['content-type'].toLowerCase();
      if (type.indexOf('zip') !== -1) {
        return resolve(extract.zip(stream));
      }

      resolve(stream);
    });
  });
};
