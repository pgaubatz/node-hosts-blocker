'use strict';

function isWhitelisted(host, pattern) {
  if (pattern instanceof RegExp) {
    return pattern.test(host);
  }
  return host === pattern;
}

module.exports = function (hosts, whitelist) {
  var removable = [];

  whitelist.forEach(function (pattern) {
    hosts.forEach(function (host, index) {
      if (isWhitelisted(host, pattern)) {
        removable.push(index);
      }
    });
  });

  return removable.reverse().map(function (index) {
    return hosts.splice(index, 1)[0];
  });
};
