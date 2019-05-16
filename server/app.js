const express = require('express');
const app = express();

let http = null, io = null;

if (process.env.IO_MODE) {
  http = require('http').Server(app);
  io = require('socket.io')(http);
}

module.exports = { app, io, http }
