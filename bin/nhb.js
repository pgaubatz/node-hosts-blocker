#!/usr/bin/env node

'use strict';

var fs = require('fs');

var byline = require('byline');
var Promise = require('bluebird');
var yargs = require('yargs');

var hostsBlocker = require('../index');

var argv = yargs
  .usage('Usage: $0 <command> [options]')
  .command('server', 'Run HTTP server', function () {
    argv = yargs
      .string('d')
      .demand('d')
      .describe('d', 'Listening IP address')
      .alias('d', 'listen-ip')
      .argv;
  })
  .command('generate', 'Generate a hosts file', function () {
    argv = yargs
      .string('l')
      .demand('l')
      .describe('l', 'Path to hosts list file')
      .alias('l', 'hosts-list')

      .string('d')
      .default('d', '127.0.0.1')
      .describe('d', 'Destination IP address')
      .alias('d', 'destination-ip')

      .string('o')
      .describe('o', 'Output (hosts) file')
      .alias('o', 'output')

      .string('w')
      .describe('w', 'Path to whitelist file')
      .alias('w', 'whitelist')
      .argv;
  })
  .demand(1, 'Error: You must provide a valid command')
  .argv;

function load(file) {
  return new Promise(function (resolve, reject) {
    var arr = [];

    function onData(line) {
      if (line[0] === '/') {
        line = new RegExp(line.substring(1, line.lastIndexOf('/')));
      }
      arr.push(line);
    }

    byline(fs.createReadStream(file, {encoding: 'utf8'}))
      .on('data', onData)
      .on('error', reject)
      .once('finish', function () {
        resolve(arr);
      });
  });
}

var command = argv._[0];

if (command === 'server') {
  hostsBlocker.createServer(argv.d)
    .once('error', function (err) {
      console.error('Cannot start HTTP server:', err);
    });

} else if (command === 'generate') {
  var sourcesPromise = load(argv.l);
  var whitelistPromise = argv.w && load(argv.w);

  Promise.all([sourcesPromise, whitelistPromise])
    .spread(function (sources, whitelist) {
      hostsBlocker.fetchHosts(sources)
        .then(function (hosts) {
          if (whitelist) {
            hostsBlocker.whitelistHosts(hosts, whitelist);
          }

          var stream = argv.output
            ? fs.createWriteStream(argv.output)
            : process.stdout;

          return hostsBlocker.writeHosts(hosts, stream, argv.d);
        });
    });

} else {
  yargs.showHelp();
}
