'use strict';

var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));

var extract = require('./extract');

function contentType(url) {
  return request.headAsync(url)
    .spread(function (res) {
      if (res.statusCode !== 200) {
        throw new Error([
          'Resource ', url, ' is not available (HTTP ', res.statusCode, ')'
        ].join(''));
      }

      return (res.headers['content-type'] || 'text/plain').toLowerCase();
    });
}

module.exports = function (url) {
  return contentType(url)
    .then(function (type) {
      return extract(type, request.get(url));
    });
};
