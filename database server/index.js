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

/**
 * /query takes parameters for querying the database
 * 
 * start, amount is mandatory
 * facility, activity,day are a list
 * 
 * use %20 for spaces in the names
 */
app.get('/query', (req, res) => {
    var start = req.query.start;
    var amount = req.query.amount;
    var order = req.query.order; 
    var table = req.query.table;
    var startTime = req.query.startTime;
    var endTime = req.query.endTime;
    var facility = req.query.facility ? req.query.facility.split(','): undefined;
    var activity = req.query.activity ? req.query.activity.split(','): undefined;
    var day = req.query.day ? req.query.day.split(','): undefined;

    var data = {
        'status code': 200,
        'amount': 0,
        'total': 0
    }

    var query = formQuery(start, amount, order, table, facility, day, startTime, endTime, activity)     

    connection.query(query.query, function(error, results, fields){
        data['position'] = Number(start);
        data['data'] = [];
        formatResults(data, results).then((data) => {
            connection.query(query.queryCount, (err, res2) => {
                data['total'] = res2[0]['COUNT(*)'];
                res.json(data)
            })
        })
    })
});

/**
 * Formats paramenters to a ready mySQL string
 * 
 * @param {number} start starting page
 * @param {number} amount amount to return
 * @param {String} order either DESC or ASC
 * @param {String} table name of the table to be ordered
 * @param {array} facility list of facilities
 * @param {number} day 1=sunday, ...
 * @param {String} startTime in HH:MM:SS format
 * @param {String} endTime in HH:MM:SS format
 */
var formQuery = (start, amount, order, table, facility, day, startTime, endTime, activity) => {
    var query = 'SELECT * FROM `schedule2020` '
    var queryCount = 'SELECT COUNT(*) FROM `schedule2020` '

    if (facility != undefined) {
        
        if (query.length == 29) { query+= ' WHERE'; queryCount += 'WHERE'}
        query += ' (';
        queryCount += '(';

        for (var i = 0; i < facility.length; i++){
            if (i !== facility.length - 1) {
                query += '`facility`=\'' + facility[i] + '\' OR ';
                queryCount += '`facility`=\'' + facility[i] + '\' OR ';
            } if (i === facility.length - 1) {
                query += '`facility`=\'' + facility[i] + '\') ';
                queryCount += '`facility`=\'' + facility[i] + '\') ';
            }
        }
    }

    if (activity != undefined) {

        if (query.length == 29) { query+= ' WHERE'; queryCount += 'WHERE'} else { query += ' AND'; queryCount += ' AND'}
        query += ' (';
        queryCount += ' (';

        for (var i = 0; i < activity.length; i++){
            if (i !== activity.length - 1) {
                query += '`activity`=\'' + activity[i] + '\' OR ';
                queryCount += '`facility`=\'' + activity[i] + '\' OR ';
            } if (i === activity.length - 1) {
                query += '`activity`=\'' + activity[i] + '\') ';
                queryCount += '`activity`=\'' + activity[i] + '\') ';
            }
        }
    }

    if (day != undefined) {

        if (query.length == 29) { query+= ' WHERE'; queryCount += 'WHERE'} else { query += ' AND'; queryCount += ' AND'}
        query += ' (';
        queryCount += ' (';

        for (var i = 0; i < day.length; i++){
            if (i !== day.length - 1) {
                query += ' DAYOFWEEK(`date`)=' + day[i] + ' OR';
                queryCount += ' DAYOFWEEK(`date`)=' + day[i] + ' OR';
            } if (i === day.length - 1) {
                query += ' DAYOFWEEK(`date`)=' + day[i] + ')';
                queryCount += ' DAYOFWEEK(`date`)=' + day[i] + ')';
            }
        }
    }
    
    if (startTime != undefined) {
        if (query.length == 29) { query+= ' WHERE'; queryCount += 'WHERE'} else { query += ' AND'; queryCount += ' AND'}
        query += ' (`startTime` > CAST(+' + startTime + ' AS time) AND `endTime` < CAST(' + endTime + ' AS time))';
        queryCount += ' (`startTime` > CAST(+' + startTime + ' AS time) AND `endTime` < CAST(' + endTime + ' AS time))';
    }

    if (order == undefined) {
        query += ' ORDER BY `date` ASC LIMIT ' + start + ', ' + amount
        queryCount += ' ORDER BY `date` ASC LIMIT ' + start + ', ' + amount
    } else if (order != undefined) {
        query += ' ORDER BY `' + table + '` ' + order + ' LIMIT ' + start + ', ' + amount
        queryCount += ' ORDER BY `' + table + '` ' + order + ' LIMIT ' + start + ', ' + amount
    }
    
    return {query, queryCount};
}

// console.log(formQuery(0, 10, 'ASC', 'date', ['Nepean Sportsplex', 'Richcraft Recreation Complex-Kanata'], [1,3,5], '10:00:00', '15:00:00'))

/**
 * Formats values into a list
 */
var formatValues = (values) => values.split(',');
 

/** 
 * Formats data from the mysql object into a list of entries
 */
var formatResults = (data, results, filter = undefined) => {
    return new Promise((resolve, reject) => {
        formatData(data, results, filter)
        if (filter == undefined) {
           resolve(data) 
        }
    })
}

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
