const app = require('../src/app');
const https = require('https');
const fs = require('fs');
const debug = require('debug')('api:server');
const express = require('express');
const port = 443;

var options = {
    key: fs.readFileSync(__dirname + '/../bin/server.key'),
    cert: fs.readFileSync(__dirname + '/../bin/server.cert')
};

var server = https.createServer(options, app).listen(port, function () {
    console.log("[HTTPS] - Listening on port " + port);
});

app.set('port', port);
module.exports = server;