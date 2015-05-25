#!/usr/bin/env node

'use strict';

var program = require('commander');

program
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .command('generate', 'generate hosts files')
  .command('server', 'run HTTP server')
  .parse(process.argv);
