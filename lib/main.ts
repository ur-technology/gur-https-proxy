/// <reference path="../typings/index.d.ts" />

import * as dotenv from 'dotenv';
import * as log from 'loglevel';

if (!process.env.NODE_ENV) {
  dotenv.config(); // if running on local machine, load config vars from .env file, otherwise these come from heroku
}

log.setDefaultLevel(process.env.LOG_LEVEL || "info")

log.info(`starting with NODE_ENV ${process.env.NODE_ENV}`);

//
// Create the HTTPS proxy server in front of a HTTP server
//
let fs = require('fs');
let httpProxy = require('http-proxy');

let bundleFile = 'relay.staging.ur.technology.bundle.crt';
let keyFile = 'relay.staging.ur.technology.key';
if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
  bundleFile = 'relay.ur.technology.bundle.crt';
  keyFile = 'relay.ur.technology.key';
}

httpProxy.createServer({
  target: {
    host: 'localhost',
    port: 9595
  },
  ssl: {
    key: fs.readFileSync(keyFile, 'utf8'),
    cert: fs.readFileSync(bundleFile, 'utf8')
  },
  secure: true
}).listen(9596);

process.on('SIGTERM', () => {
  log.info(`Exiting...`);
  process.exit(0);
});
