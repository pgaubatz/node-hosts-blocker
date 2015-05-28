#!/usr/bin/env node

'use strict';

var program = require('commander');

var hostsBlocker = require('../index');

program
  .version(require('../package.json').version)
  .option('-d, --listen-ip <ip>', 'Listening IP address (required)')
  .option('-u, --ui-hostname <hostname>', 'Hostname for the Web-UI', 'hosts-blocker')
  .parse(process.argv);

if (!program.listenIp) {
  program.help();
}

hostsBlocker.createServer(program.listenIp, program.uiHostname)
  .once('error', function (err) {
    console.error('Cannot start HTTP server:', err);
  });

console.log('Host-Blocker\'s Web-UI is available at: http://' + program.uiHostname);
