'use strict';

function isWhitelisted(host, pattern) {
  if (pattern instanceof RegExp) {
    return pattern.test(host);
  }
  return host === pattern;
}

module.exports = function (hosts, whitelist) {
  var remaining = hosts.slice(); // clone hosts array
  var removable = [];

  whitelist.forEach(function (pattern) {
    hosts.forEach(function (host, index) {
      if (isWhitelisted(host, pattern)) {
        removable.push(index);
      }
    });
  });

  removable.reverse().forEach(function (index) {
    remaining.splice(index, 1);
  });

  return remaining;
};
