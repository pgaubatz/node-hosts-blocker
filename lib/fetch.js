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

      resolve((res.headers['content-type'] || 'text/plain').toLowerCase());
    });
  });
}

module.exports = function (url) {
  return contentType(url)
    .then(function (type) {
      return extract(type, request.get(url));
    });
};
