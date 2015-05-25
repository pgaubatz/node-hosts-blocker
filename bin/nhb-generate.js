#!/usr/bin/env node

'use strict';

var fs = require('fs');

var byline = require('byline');
var Promise = require('bluebird');
var program = require('commander');

var hostsBlocker = require('../index');

program
  .version(require('../package.json').version)
  .option('-l, --hosts-list <path>', 'Path to hosts list file (required)')
  .option('-d, --destination-ip <ip>', 'Destination IP address')
  .option('-o, --output <path>', 'Output (hosts) file')
  .option('-w, --whitelist <path>', 'Path to whitelist file')
  .parse(process.argv);

if (!program.hostsList) {
  program.help();
}

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

var sourcesPromise = load(program.hostsList);
var whitelistPromise = program.whitelist && load(program.whitelist);
Promise.all([sourcesPromise, whitelistPromise])
  .spread(function (sources, whitelist) {
    hostsBlocker.fetchHosts(sources)
      .then(function (hosts) {
        if (whitelist) {
          hosts = hostsBlocker.whitelistHosts(hosts, whitelist);
        }

        var stream = program.output
          ? fs.createWriteStream(program.output)
          : process.stdout;

        return hostsBlocker.writeHosts(hosts, stream, program.destinationIp);
      });
  });
