'use strict';

require('chai').should();

var fs = require('fs');
var path = require('path');

var StringStream = require('./utils/string-stream');
var extract = require('../lib/extract');

describe('extract()', function () {
  it('should passthrough plaintext', function (done) {
    var hello = 'hello world';
    extract('text/plain', new StringStream([hello]))
      .on('data', function (chunk) {
        chunk.toString().should.equal(hello);
        done();
      });
  });
  it('should throw an error for a non-extractable MIME type', function () {
    var mime = 'no/such/mime/type';
    extract.bind(null, mime).should.throw(Error, 'No matching extractor for MIME type ' + mime);
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
  it('should emit an error and close the read stream for unparsable archives', function (done) {
    extract('application/zip', new StringStream(['this is no zip']))
      .on('error', function (err) {
        err.should.be.an.instanceof(Error);
      })
      .on('end', function () {
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
