var express = require('express')
var app = express()
var mysql = require('mysql')

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))

var db_conn = mysql.createConnection(
{
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'henrybooks'
})

app.get('/', function (req, res) 
{
	tables = ['author', 'book', 'copy', 'publisher']

	res.render('index', { title: 'rconc016 - COP4710', tables: tables })
})

app.get('/display_table', function (req, res) 
{
	table = req.query.table
	mode = req.query.mode

	db_conn.query("SELECT * FROM " + table, function (err, result, fields)
	{
		if (err) 
			res.render('error', { table: table, rows: result, columns: columns })

		else
		{
			columns = []

			fields.forEach(function(item) {
				columns.push(item.name)
			})		

			if (!mode || mode == 0)
				res.render('display_table', { title: table, table: table, rows: result, columns: columns })

			else if (mode == 1)
				res.render('display_table_text', { title: table, table: table, rows: result, columns: columns })
		}
	})
})

app.get('/add_row', function (req, res) 
{
	table = req.query.table
	columns = req.query.columns

	res.render('add_row', { title: 'Add New Row', table: table, columns: columns })
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