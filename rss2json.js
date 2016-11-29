'use strict';

const http = require('http');
const xml2js = require('xml2js');

const parserOptions = {
  explicitArray: false, 
  async: true,
  mergeAttrs: true
};
const parser = new xml2js.Parser(parserOptions);


module.exports = function main(url, callback) {
  var xmlString = '';
  http.get(url, function(response) {
    response.on('data', function(chunk) {
      xmlString += chunk.toString();
    });
    response.on('end', function(r) {
      parser.parseString(xmlString, function(err, res) {
        callback(err, (res || {}).rss);
      });
    });
  },
  function(err) {
    callback(err);
  });
};