import 'dotenv/config';
import app from '../src/app'
import https from 'https'
import fs from 'fs'
import express from 'express'
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