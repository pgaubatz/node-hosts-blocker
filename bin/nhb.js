#!/usr/bin/env node

'use strict';

var fs = require('fs');
var optimist = require('optimist');

var lib = require('../lib/');

var argv = optimist
  .describe('c', 'path to config file')
  .describe('s', 'run HTTP server')
  .describe('o', 'output file')
  .alias('c', 'config')
  .alias('s', 'server')
  .alias('h', 'help')
  .alias('o', 'output')
  .default('s', false)
  .string('c')
  .string('o')
  .demand('c')
  .argv;

var config;

try {
  config = JSON.parse(fs.readFileSync(argv.config));
} catch (e) {
  console.error('Cannot read config file: ', e.message);
  throw e;
}

if (argv.help) {
  optimist.showHelp();

} else if (argv.server) {
  lib.createServer(config.destinationIP);

} else {
  lib.fetchHosts(config.sources)
    .then(function (hosts) {
      var s = argv.output ? fs.createWriteStream(argv.output) : process.stdout;
      return lib.writeHosts(hosts, s, config.destinationIP);
    });
}
