'use strict';

var plain = require('./plain');
var extract = require('../extract');

module.exports = function (url) {
  return extract.zip(plain(url));
};
