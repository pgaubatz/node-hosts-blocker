#!/usr/bin/env node

'use strict';

var program = require('commander');

var hostsBlocker = require('../index');

program
  .version(require('../package.json').version)
  .option('-d, --listen-ip <ip>', 'Listening IP address (required)')
  .option('-p, --listen-port <port>', 'Listening port', 80)
  .option('-u, --ui-hostname <hostname>', 'Hostname for the Web-UI', 'hosts-blocker')
  .parse(process.argv);

if (!program.listenIp) {
  program.help();
}

hostsBlocker.createServer(program.listenIp, program.listenPort, program.uiHostname)
  .once('error', function (err) {
    console.error('Cannot start HTTP server:', err);
  });

var hostPort = program.uiHostname;
if (program.listenPort !== 80) {
  hostPort += ':' + program.listenPort;
}

console.log('Host-Blocker\'s Web-UI is available at: http://' + hostPort);
