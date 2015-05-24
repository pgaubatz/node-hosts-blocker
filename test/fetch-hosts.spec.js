'use strict';

require('chai')
  .use(require('chai-as-promised'))
  .should();

var path = require('path');

var nock = require('nock');

var fetchHosts = require('../lib/fetch-hosts');

describe('fetchHosts()', function () {
  var HOSTS_FILES = ['hosts-1.txt', 'hosts-2.zip', 'hosts-3.txt'];
  var URL = 'http://localhost';
  var URLS = [];

  before(function () {
    HOSTS_FILES.forEach(function (file) {
      var p = '/' + file;

      URLS.push(URL + p);

      nock(URL)
        .head(p).reply(200)
        .get(p).replyWithFile(200, path.join(__dirname, 'fixtures', file));
    });
  });
  after(nock.cleanAll);

  it('should fetch, merge and sort hosts files from a configurable list of URLs', function () {
    fetchHosts(URLS)
      .should.eventually.be.an('array')
      .and.should.eventually.deep.equal(['a', 'b', 'c', 'localhost']);
  });
});
