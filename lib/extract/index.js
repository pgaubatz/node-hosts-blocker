'use strict';

var requireDir = require('require-dir');

function passthrough(stream) {
  return stream;
}

var extractors = {
  'text/plain': passthrough,
  'plain/text': passthrough
};

var modules = requireDir('.');

Object.keys(modules).forEach(function (id) {
  var module = modules[id];

  module.mimeTypes.forEach(function (type) {
    extractors[type] = module;
  });
});

module.exports = function (mimeType, stream) {
  var extractor = extractors[mimeType];

  if (!extractor) {
    throw new Error('No matching extractor for MIME type ' + mimeType);
  }

  return extractor(stream);
};

module.exports.mimeTypes = function () {
  return Object.keys(extractors);
};
