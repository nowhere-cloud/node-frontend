#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('node-apimanager:server');
const http = require('http');
const models = require('../models');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '80');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    throw new Error(`${bind} requires elevated privileges`);
  case 'EADDRINUSE':
    throw new Error(`${bind} is already in use`);
  default:
    throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug(`Listening on ${bind}`);
}

/**
 * On Front-end website, the only requirement
 * is ensure MySQL is ready (for authentication)
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
