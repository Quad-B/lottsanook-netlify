'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser);
app.get('/updatestate', (req, res) => {
  const newValue = ["0"];
  res.json(newValue);
});

module.exports.handler = serverless(app);