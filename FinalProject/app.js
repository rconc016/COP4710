var express = require('express');
var app = express();

app.set('view engine', 'pug')

app.get('/', function (req, res) {
   res.render('index', { title: 'rconc016 - COP4710' })
})

var server = app.listen(8080, '127.0.0.1', function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})