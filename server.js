require('dotenv').config();

const express = require('express');

const app = express();
const port = process.env.NODE_PORT || 8080;
const task = process.env.NODE_ENV || 'development';

if (task !== 'test') {
  app.listen(port);
}

module.exports = app;
