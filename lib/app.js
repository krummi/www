'use strict';

const _ = require('lodash');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const log = require('node-oz-helpers').getLogger();

// Maintains the blogs in memory - blazingly fast ;)
const blogsRepo = require('./blogs');

const app = express();

// Express app setup

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Routes

app.get('/', (req, res, next) => {
  let blogsBySlug = blogsRepo.getBlogs();
  res.render('index', { blogs: blogsBySlug });
});

app.get('/about', (req, res, next) => {
  res.render('about');
});

app.get('/:blog', (req, res, next) => {
  let blogsBySlug = blogsRepo.getBlogs();
  if (_.has(blogsBySlug, req.params.blog)) {
    res.render('blog', { blog: blogsBySlug[req.params.blog] });
  } else {
    // TODO: make a simple 404 page.
    console.log('not found :(');
    res.status(404).end();
  }
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
