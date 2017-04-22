/**
 * Module dependencies.
 */
const fs = require('fs');
const path = require('path');
// const express = require('express');
// const session = require('express-session');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const winston = require('winston');
const helmet = require('helmet');

const env = process.env.NODE_ENV || 'development';
// const cookieSecret = process.env.SESSION_SECRET || 'secret';

/**
 * Expose
 */

module.exports = function (app) {
  app.use(helmet.noCache());
  app.use(helmet.frameguard());

  // Compression middleware (should be placed before express.static)
  app.use(compression({
    threshold: 512,
  }));

  // Use winston on production
  let log = 'dev';
  if (env !== 'development') {
    log = {
      stream: {
        write: message => winston.info(message),
      },
    };
  }

  // Don't log during tests
  // Logging middleware
  if (env !== 'test') {
    app.use(morgan(log));
  }

  const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });

  // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }));

  // bodyParser should be above methodOverride
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  if (env === 'development') {
    app.locals.pretty = true;
  }
};
