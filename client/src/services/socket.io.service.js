import { IO_URL, IO_MODE } from '../config';

let socket;

if (IO_MODE) {
  socket = require('socket.io-client')(IO_URL);
  socket.on('update', field => require('./event.service').$emit(`DB:updated:${field}`));
} else {
  socket = null;
}

export { socket }
