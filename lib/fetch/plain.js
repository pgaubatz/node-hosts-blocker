'use strict';

var request = require('request');

module.exports = function (url) {
  return request({
    url: url,
    method: 'GET',
    gzip: true
  }).on('error', function (err) {
    console.error('Cannot fetch', url, ':', err);
  });
};
