#!/usr/bin/env node

'use strict';

var program = require('commander');

var hostsBlocker = require('../index');

program
  .version(require('../package.json').version)
  .option('-d, --listen-ip <ip>', 'Listening IP address (required)')
  .parse(process.argv);

if (!program.listenIp) {
  program.help();
}

hostsBlocker.createServer(program.listenIp)
  .once('error', function (err) {
    console.error('Cannot start HTTP server:', err);
  });

