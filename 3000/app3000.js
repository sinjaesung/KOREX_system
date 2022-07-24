const app = require('express')();
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require("path");

const PORT = 3000;

/*
const SSL_PORT = 443;

const options = {
    key: fs.readFileSync(__dirname + '/keystore1/www.linkda.io_202103293D1J.key.pem'),
    cert: fs.readFileSync(__dirname + '/keystore1/www.linkda.io_202103293D1J.crt.pem'),
    ca: fs.readFileSync(__dirname + '/keystore1/www.linkda.io_202103293D1J.ca-bundle.pem')
};
*/

app.use(cors());
app.use(express.static(__dirname));

app.get("*", function(req, res) {
  res.sendFile(path.resolve(__dirname, "./build/index.html"));
});


const server = app.listen(PORT);
//const server = https.createServer(options, app).listen(SSL_PORT);