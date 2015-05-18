'use strict';

var plain = require('./plain');
var zip = require('./zip');
var contentType = require('./content-type');

module.exports = function (url) {
  return contentType(url)
    .then(function (type) {
      if (type.indexOf('zip') !== -1) {
        return zip(url);
      }
      return plain(url);
    });
};
module.exports.plain = plain;
module.exports.zip = zip;
