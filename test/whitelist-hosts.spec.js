'use strict';

require('chai').should();

var whitelistHosts = require('../lib/whitelist-hosts');

describe('whitelistHosts()', function () {
  it('should remove whitelisted hosts from the list of hosts', function () {
    var hosts = ['a'];

    whitelistHosts(hosts, ['a']);

    hosts.should.have.length(0);
  });
  it('should return an array of whitelisted hosts', function () {
    var whitelisted = whitelistHosts(['a', 'b', 'c'], ['b', 'c']);

    whitelisted.should.be.an('array');
    whitelisted.should.have.length(2);
    whitelisted.should.include('b');
    whitelisted.should.include('c');
  });
  it('should accept both, strings and regular expressions as whitelist patterns', function () {
    var hosts = ['a', 'host', 'www.host', 'x'];
    var whitelist = [
      'a',
      /host$/i
    ];
    var whitelisted = whitelistHosts(hosts, whitelist);

    hosts.should.have.length(1);
    hosts.should.include('x');

    whitelisted.should.have.length(3);
    whitelisted.should.include('a');
    whitelisted.should.include('host');
    whitelisted.should.include('www.host');
  });
});
