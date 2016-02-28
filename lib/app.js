'use strict';

let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let log = require('node-oz-helpers').getLogger();

// Maintains the blogs in memory - blazingly fast ;)
let blogsRepo = require('./blogs');

let app = express();

// Express app setup

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Routes

app.get('/', function (req, res, next) {
  log.info('testing! #2');
  res.render('index');
});

app.get('/about', function (req, res, next) {
  res.render('about');
});

// Setup the development environment

if (app.get('env') === 'development') {
  // Pretty print Jade.
  app.locals.pretty = true;

  // Error handling.
  app.use(function(err, req, res, next) {
    log.error({ err: err }, 'Error hit in development.');
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler

app.use(function(err, req, res, next) {
  log.error({ err: err }, 'Error hit in development.');
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.set('port', process.env.PORT || 3000);

module.exports = app;
