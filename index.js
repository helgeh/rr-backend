'use strict';

const express = require('express');
const http = require('http');

const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const app = express();

app.get('/', (req, res) => {
  let url = req.query.url || '';
  let xmlString = '';
  http.get(url, function(response) {
    response.on('data', function(chunk) {
      xmlString += chunk.toString();
    });
    response.on('end', function(r) {
      parser.parseString(xmlString, function(err, result) {
        if (err) {
          res.status(500).end();
          return;
        }
        res.json(result);
      });
    });
  }, function(err) {
    res.status(500).end();
  });
});

app.listen(80);