'use strict';

var request = require('request');
var Promise = require('bluebird');

var extract = require('./extract');

function contentType(url) {
  return new Promise(function (resolve, reject) {
    request.head(url, function (err, res) {
      if (err) {
        return reject(err);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(
          'Resource ' + url +
          ' is not available (HTTP ' + res.statusCode + ')'
        ));
      }

      resolve(res.headers['content-type'].toLowerCase());
    });
  });
}

module.exports = function (url) {
  return contentType(url)
    .then(function (type) {
      var stream = request.get(url);

      if (type.indexOf('zip') !== -1) {
        return extract.zip(stream);
      }

      return stream;
    });
};
