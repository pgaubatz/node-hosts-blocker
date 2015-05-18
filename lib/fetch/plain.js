'use strict';

var request = require('request');

module.exports = function (url) {
  var r = request({
    url: url,
    method: 'GET',
    gzip: true
  });

  //r.on('close', function () {
  //  console.error('Fetched', url);
  //});
  r.on('error', function (err) {
    console.error('Cannot fetch', url, ':', err);
  });

  return r;
};
