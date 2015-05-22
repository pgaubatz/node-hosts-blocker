'use strict';

require('chai').should();

var whitelistHosts = require('../lib/whitelist-hosts');

describe('whitelistHosts()', function () {
  it('should remove whitelisted hosts from the list of hosts', function () {
    whitelistHosts(['a'], ['a'])
      .should.not.include('a');
  });
  it('should accept both, strings and regular expressions as whitelist patterns', function () {
    var hosts = whitelistHosts(['a', 'host', 'www.host', 'x'], ['a', /host$/i]);

    hosts.should.include('x');

    hosts.should.not.include('a');
    hosts.should.not.include('host');
    hosts.should.not.include('www.host');
  });
});
