var http = require('http'),
    express = require('express'),
    app = express();


var server = app.listen(8000, "127.0.0.1", function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Schedule site listening at http://%s:%s", host, port);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/" + "index.html");
});

// Non HTML files

app.get('/js/op.js', (req, res) => {
    res.sendFile(__dirname + '/js/op.js');
});

app.get('/js/calls.js', (req, res) => {
    res.sendFile(__dirname + '/js/calls.js');
});