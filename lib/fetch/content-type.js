'use strict';

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

module.exports = function (url) {
  return request({
    url: url,
    gzip: true,
    method: 'HEAD'
  }).spread(function (response) {
    return (response.headers['content-type'] || 'text/plain').toLowerCase();
  });
};
