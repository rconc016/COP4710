var express = require('express')
var app = express()
var mysql = require('mysql')

app.set('view engine', 'pug')

var db_conn = mysql.createConnection(
{
	host: 'localhost',
	user: 'root',
	password: 'root'
})

app.get('/', function (req, res) 
{
	tables = ['author', 'book', 'copy', 'publisher']

	res.render('index', { title: 'rconc016 - COP4710', tables: tables })
})

db_conn.connect(function(err) 
{
	if (err) throw err
	console.log("Connected to the MySQL database!")

	var server = app.listen(8080, '127.0.0.1', function () 
	{
	   var host = server.address().address
	   var port = server.address().port
	   
	   console.log("Example app listening at http://%s:%s", host, port)
	})
})