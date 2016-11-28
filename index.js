'use strict';

const express = require('express');
const http = require('http');
const xml2js = require('xml2js');

const parserOptions = {
  explicitArray: false, 
  async: true,
  mergeAttrs: true
};
const parser = new xml2js.Parser(parserOptions);
const app = express();

app.get('/feed/:url', (req, res) => {

  let url = req.params.url || req.query.feed;
  let jsonp = !!(req.query.callback);
  let xmlString = '';

  if (!url)
    res.status(400).end();

  let onSuccess = function(response) {
    response.on('data', function(chunk) {
      xmlString += chunk.toString();
    });
    response.on('end', function(r) {
      parser.parseString(xmlString, function(err, result) {
        if (err) {
          res.status(404).end();
          return;
        }
        if (jsonp)
          res.jsonp(result.rss);
        else
          res.json(result.rss);
      });
    });
  };

  let error = function(err) {
    res.status(500).end();
  };

  http.get(url, onSuccess, error);

});

app.listen(80);