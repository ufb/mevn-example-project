const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { db, port, socketPort } = require('./config');
const jwt = require('jsonwebtoken');
const errors = require('./middleware/mw.errors');
const router = require('./routes');
const { app, http, io } = require('./app');

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());

// router
app.use(router);

// static file
app.use(express.static(path.join(__dirname, 'public')));

// middleware: handle errors
app.use(errors);

if (io) io.on('connection', socket => socket.on('success', field => socket.broadcast.emit('update', field)));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(db)
  .then(() => app.listen(port))
  .catch(err => console.dir('err', err));

if (io && http) http.listen(socketPort, () => { console.log(`server listening on port ${port}`)});
