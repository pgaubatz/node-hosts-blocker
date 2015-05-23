'use strict';

require('chai').should();

var fs = require('fs');
var path = require('path');

var StringStream = require('./utils/string-stream');
var extract = require('../lib/extract');

describe('extract()', function () {
  it('should return passthrough plaintext', function (done) {
    var hello = 'hello world';
    extract('text/plain', new StringStream([hello]))
      .on('data', function (chunk) {
        chunk.toString().should.equal(hello);
        done();
      });
  });
  it('should extract hosts files from archives', function (done) {
    var zipFile = path.join(__dirname, 'fixtures', 'hosts-2.zip');
    var content = '';
    extract('application/zip', fs.createReadStream(zipFile))
      .on('data', function (chunk) {
        content += chunk;
      })
      .once('end', function () {
        content.should.have.string('localhost');
        done();
      });
  });
  describe('extract.mimeTypes()', function () {
    it('should return an array of extractable MIME types', function () {
      var mimeTypes = extract.mimeTypes();
      mimeTypes.should.be.an('array');
      mimeTypes.should.include('text/plain');
    });
  });
});
