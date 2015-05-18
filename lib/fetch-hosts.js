'use strict';

var Promise = require('bluebird');

var parse = require('./parse');
var fetch = require('./fetch');

module.exports = function (urls) {
  var parsedHosts = urls.map(function (url) {
    return parse(fetch(url));
  });

  return Promise.all(parsedHosts)
    .then(function (arrays) {
      return arrays.reduce(function (previous, current) {
        return previous.concat(current);
      }, []);
    })
    .then(function uniqueHosts(arr) {
      var unique = {};

      for (var i = arr.length - 1; i >= 0; i--) {
        unique[arr[i]] = 1;
      }

      return Object.keys(unique);
    })
    .then(function sortHosts(uniqueHosts) {
      return uniqueHosts.sort();
    });
};
