// var http = require('http');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!');
// }).listen(8080); 

let database = require('./utilities');
let express = require('express');
let app = express();

app.get('/', (req, res) => {
    res.send("Hello world!")
})

app.listen(3000)

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