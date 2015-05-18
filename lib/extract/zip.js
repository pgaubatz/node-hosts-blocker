'use strict';

var through = require('through');
var unzip = require('unzip2');

var HOST_FILE_REGEXP = /^hosts(\.txt)?$/i;

module.exports = function (stream) {
  var extracted = through(function (data) {
    this.emit('data', data);
  });

  stream
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      if (HOST_FILE_REGEXP.test(entry.path.toLowerCase())) {
        return entry.pipe(extracted);
      }
      entry.autodrain();
    })
    .once('error', function (err) {
      extracted.emit('error', err);
      extracted.end();

      // FIXME: ugly hack ahead...
      // (see https://github.com/glebdmitriew/node-unzip-2/issues/8)
      this._streamEnd = true;
      this._streamFinish = true;

      this.end();
    });

  return extracted;
};
