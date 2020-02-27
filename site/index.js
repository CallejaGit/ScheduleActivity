var http = require('http');
var database = require('./utilities');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!');
}).listen(8080); 

/**
 * Example of using connectAndFind
 */
database.connectAndFind('mongodb://localhost:27017', 
    'test', 
    'testCollection', 
    {'Facility-Activity': 'Cardio and Strength Older Adult'}, 
    (items) => {
        console.log(items);
        console.log('HERE');
    });