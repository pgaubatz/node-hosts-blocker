'use strict';

module.exports = {
  fetchHosts: require('./lib/fetch-hosts'),
  whitelistHosts: require('./lib/whitelist-hosts'),
  writeHosts: require('./lib/write-hosts'),
  createServer: require('./lib/create-server')
};
