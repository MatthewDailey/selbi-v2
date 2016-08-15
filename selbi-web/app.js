var express = require('express');
var http = require('http');
var app = express();

app.get('/', function (req, res) {
  res.send({
  	status: 'OK',
  	service: 'web'
  });
});

app.listen(8080);

