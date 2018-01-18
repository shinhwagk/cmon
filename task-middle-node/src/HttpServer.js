"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var server = http.createServer(function (req, res) {
    var ip = req.socket.remoteAddress;
    console.info(req.url)
    console.info(req.method)
    const body = []
    req.on('data', function (chunk) {
        console.info("xxx")
        body.push(body)
    });
    var port = req.socket.remotePort;
    res.end("Your IP address is " + ip + " and your source port is " + port + ".");
}).listen(3000);
