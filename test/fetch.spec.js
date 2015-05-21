'use strict';

require('chai')
  .use(require('chai-as-promised'))
  .should();

var fetch = require('../lib/fetch');

describe('fetch()', function () {
  it('should return a promise to a pipeable stream', function () {
    return fetch('http://google.com')
      .should.eventually.respondTo('pipe');
  });
  it('should throw an error if the hostname cannot be resolved', function () {
    return fetch('http://does.not.exist')
      .should.be.rejectedWith(Error, 'getaddrinfo ENOTFOUND');
  });
  it('should throw an error if the HTTP status code != 200', function () {
    var url = 'http://google.com/does/not/exist';
    return fetch(url)
      .should.be.rejectedWith(Error, 'Resource ' + url + ' is not available (HTTP 404)');
  });
});
