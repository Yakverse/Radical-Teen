const app = require('../src/app');
const https = require('https');
var fs = require('fs')
const debug = require('debug')('api:server');
const express = require('express');
const port = 443;

var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

var server = https.createServer(options, app).listen(port, function () {
    console.log("Express listening on port " + port);
});

app.set('port', port);