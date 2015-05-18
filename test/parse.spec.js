'use strict';

require('chai').should();

var StringStream = require('./utils/string-stream');
var parse = require('../lib/parse');

describe('parse()', function () {
  it('should return a promise for a list of hosts', function (done) {
    parse(new StringStream(['127.0.0.1 localhost'])).then(function (hosts) {
      hosts.should.be.an('array');
      hosts.should.have.length(1);
      hosts.should.include('localhost');
      done();
    });
  });
  it('should ignore comments and whitespaces', function (done) {
    var stream = new StringStream([
      ' 127.0.0.1  h1     ',
      '#127.0.0.1  h2',
      ' 127.0.0.1 # h3',
      ' 127.0.0.1  h4  #comment'
    ]);
    parse(stream).then(function (hosts) {
      hosts.should.have.length(2);
      hosts.should.not.include('h2');
      hosts.should.not.include('h3');
      done();
    });
  });
  it('should parse IPv4 and IPv6 addresses', function (done) {
    var stream = new StringStream([
      '127.0.0.1  h1',
      '::1    h2'
    ]);
    parse(stream).then(function (hosts) {
      hosts.should.have.length(2);
      hosts.should.include('h1');
      hosts.should.include('h2');
      done();
    });
  });
  it('should always return a promise for an array', function (done) {
    parse(new StringStream([])).then(function (hosts) {
      hosts.should.be.an('array');
      hosts.should.have.length(0);
      done();
    });
  });

  //describe('#export()', function() {
  //  it('should filter duplicate hosts', function(done) {
  //    store.import(new StringStream([
  //      '127.0.0.1 h1',
  //      '127.0.0.1 h1'
  //    ]))
  //      .then(function() {
  //        store.export(es.writeArray(function(err, lines) {
  //          lines.should.be.an('array');
  //          lines.should.deep.equal(['0.0.0.0\th1']);
  //          done();
  //        }));
  //      });
  //  });
  //  it('should order hosts', function(done) {
  //    store.import(new StringStream([
  //      '127.0.0.1 b',
  //      '127.0.0.1 a'
  //    ]))
  //      .then(function() {
  //        store.export(es.writeArray(function(err, lines) {
  //          lines.should.be.an('array');
  //          lines.should.deep.equal(['0.0.0.0\ta', '\n', '0.0.0.0\tb']);
  //          done();
  //        }));
  //      });
  //  });
  //  it('should allow the destination IP to be overridden', function(done) {
  //    store.import(new StringStream(['127.0.0.1 h1'])).then(function() {
  //      var writer = es.writeArray(function(err, lines) {
  //        lines.should.be.an('array');
  //        lines.should.deep.equal(['1.2.3.4\th1']);
  //        done();
  //      });
  //      store.export(writer, '1.2.3.4');
  //    });
  //  });
  //});
});
