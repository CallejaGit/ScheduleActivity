// var http = require('http');
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors')

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
}));

app.use(cors())
// app.use(cors({ origin: true, credentials: true }));

var server = app.listen(3000, "127.0.0.1", function(){
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

var formatRes = (results, filter = undefined) => {
    formatted = {'status code': 200,
                    'amount': 0,
                    'total': 0};
    if (filter != undefined) {
        formatted[filter] = [];
        results.forEach(element => {
            formatted[filter].push(element[filter])
            formatted.amount++;
        });
    } else {
        formatted["data"] = []
        results = results.map(v => Object.assign({}, v));
        results.forEach(element => {
            results.forEach(element => { element.date = String(element.date).substring(0,15) });
            formatted.data.push(element);
            formatted.amount++;
        });
    }

    return formatted;
}

var sqlResults = ((results, filter = undefined) => {
    return new Promise((resolve, reject) => {
        var formatted = formatRes(results, filter)
        if (formatted != undefined) {
           resolve(formatted) 
        }
    })
})

// async function getTotal(formatted) {
//     connection.query('SELECT COUNT(*) FROM schedule2020', (err, res) => {
//     formatted['total'] = results[0]['COUNT(*)']
//     });
// }

app.get('/activity', function(req, res) {
    connection.query('SELECT DISTINCT `activity` FROM `schedule2020` ', function(error, results, fields){
        if (error) throw error;
        res.json(formatRes(results, "activity"));
    });
});

app.get('/facility', function(req, res) {
    connection.query('SELECT DISTINCT `facility` FROM `schedule2020` ', function(error, results, fields){
        if (error) throw error;
        res.json(formatRes(results, "facility"));
    });
});

app.get('/date', function(req, res) {
    connection.query('SELECT DISTINCT `date` FROM `schedule2020` ', function(error, results, fields){
        if (error) throw error;
        res.json(formatRes(results, "date"));
    });
});

app.get('/query', (req, res) => {
    var start = req.query.start;
    var amount = req.query.amount;
    var order = req.query.order; // order == undefined if not used
    var sort = req.query.sort;

    var data = {
        'status code': 200,
        'amount': 0,
        'total': 0
    }

    if (order == undefined && sort == undefined) {
        connection.query('SELECT * FROM `schedule2020` ORDER BY `date` ASC LIMIT ' + start + ',' + amount, function(error, results, fields){
            data['position'] = Number(start);
            data['data'] = [];
            formatResults(data, results).then((data)=> {
                connection.query('SELECT COUNT(*) FROM schedule2020', (err, res2) => {
                    data['total'] = res2[0]['COUNT(*)'];
                    res.json(data)
                });
            })            
        })
    } else if (order != undefined && sort == undefined) {
        connection.query('SELECT * FROM `schedule2020` ORDER BY `' + order + '` ' + sort + ' LIMIT ' + start + ',' + amount, function(error, results, fields){
            data['position'] = Number(start);
            data['data'] = [];
            formatResults(data, results).then((data)=> {
                connection.query('SELECT COUNT(*) FROM schedule2020', (err, res2) => {
                    data['total'] = res2[0]['COUNT(*)'];
                    res.json(data)
                });
            })            
        })
    }
});


var formatData = (data, results, filter = undefined) => {
    if (filter != undefined) {
        data[filter] = [];
        results.forEach(element => {
            data[filter].push(element[filter])
            data.amount++;
        });
    } else {
        data["data"] = []
        results = results.map(v => Object.assign({}, v));
        results.forEach(element => {
            results.forEach(element => { element.date = String(element.date).substring(0,15) });
            data.data.push(element);
            data.amount++;
        });
    }

    return data;
}

var formatResults = (data, results, filter = undefined) => {
    return new Promise((resolve, reject) => {
        formatData(data, results, filter)
        if (filter == undefined) {
           resolve(data) 
        }
    })
}