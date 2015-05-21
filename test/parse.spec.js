'use strict';

require('chai')
  .use(require('chai-as-promised'))
  .should();

var StringStream = require('./utils/string-stream');
var parse = require('../lib/parse');

describe('parse()', function () {
  it('should return a promise for a list of hosts', function () {
    return parse(new StringStream(['127.0.0.1 localhost']))
      .should.eventually.be.an('array')
      .and.have.length(1)
      .and.include('localhost');
  });
  it('should ignore comments and whitespaces', function () {
    var stream = new StringStream([
      ' 127.0.0.1  h1     ',
      '#127.0.0.1  h2',
      ' 127.0.0.1 # h3',
      ' 127.0.0.1  h4  #comment'
    ]);
    return parse(stream)
      .should.eventually.have.length(2)
      .and.not.include('h2')
      .and.not.include('h3');
  });
  it('should parse IPv4 and IPv6 addresses', function () {
    var stream = new StringStream([
      '127.0.0.1  h1',
      '::1    h2'
    ]);
    return parse(stream)
      .should.eventually.have.length(2)
      .and.include('h1')
      .and.include('h2');
  });
  it('should always return a promise for an array', function () {
    return parse(new StringStream([]))
      .should.eventually.be.an('array')
      .and.have.length(0);
  });
});
