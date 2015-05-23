'use strict';

require('chai')
  .use(require('chai-as-promised'))
  .should();

var nock = require('nock');

var fetch = require('../lib/fetch');

describe('fetch()', function () {
  afterEach(nock.cleanAll);

  it('should return a promise to a pipeable stream', function () {
    var URL = 'http://localhost';

    nock(URL)
      .head('/').reply(200, {'content-type': 'text-plain'})
      .get('/').reply(200, 'hello world!');

    return fetch(URL)
      .should.eventually.respondTo('pipe');
  });
  it('should throw an error if the hostname cannot be resolved', function () {
    return fetch('http://does.not.exist')
      .should.be.rejectedWith(Error, 'getaddrinfo ENOTFOUND');
  });
  it('should throw an error if the HTTP status code != 200', function () {
    var URL = 'http://localhost/';

    nock(URL)
      .head('/').reply(404, {'content-type': 'text-plain'});

    return fetch(URL)
      .should.be.rejectedWith(Error, 'Resource ' + URL + ' is not available (HTTP 404)');
  });
});
