// var http = require('http');
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser')

// create MYSQL connection in Nodejs
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'Schedules'
});

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
});

// Body Parser Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

var server = app.listen(3000, "127.0.0.1", function(){
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

app.get('/activities', function(req, res) {
    connection.query('SELECT DISTINCT `activity` FROM `schedule2020` ', function(error, results, fields){
         if (error) throw error;
         res.end(JSON.stringify(results));
    });
});

app.get('/facility', function(req, res) {
    connection.query('SELECT DISTINCT `facility` FROM `schedule2020` ', function(error, results, fields){
         if (error) throw error;
         res.end(JSON.stringify(results));
    });
});

app.get('/date', function(req, res) {
    connection.query('SELECT DISTINCT `date` FROM `schedule2020` ', function(error, results, fields){
         if (error) throw error;
         res.end(JSON.stringify(results));
    });
});

app.get('/query', (req, res) => {
    var start = req.query.start;
    var amount = req.query.amount;
    var order = req.query.order; // order == undefined if not used
    var sort = req.query.sort;

    if (order == undefined) {
        connection.query('SELECT * FROM `schedule2020` ORDER BY `date` ASC LIMIT ' + start + ',' + amount, function(error, results, fields){
            if (error) throw error;
            res.end(JSON.stringify(results));
        })
    } else if (order != undefined) {
        connection.query('SELECT * FROM `schedule2020` ORDER BY `' + order + '` ' + sort + ' LIMIT ' + start + ',' + amount, function(error, results, fields){
            if (error) throw error;
            res.end(JSON.stringify(results));
        })
    }

});

// var app = http.createServer(function(req,res){
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify({ a: 1 }));
// });
// app.listen(3000);