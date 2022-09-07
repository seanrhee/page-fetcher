const args = process.argv.slice(2);
const request = require('request');
const fs = require('fs');

const net = require('net');

const conn = net.createConnection({
  host: args[0],
  port: 80
});

request(args[0], function(error, response, body) {
  
})