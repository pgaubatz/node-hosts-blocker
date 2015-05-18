'use strict';

var Readable = require('stream').Readable;
var util = require('util');

function StringStream(lines, opt) {
  Readable.call(this, opt);
  this._str = lines.join('\n');
}

util.inherits(StringStream, Readable);

StringStream.prototype._read = function () {
  this.push(new Buffer(this._str, 'utf8'));
  this.push(null);
};

module.exports = StringStream;
