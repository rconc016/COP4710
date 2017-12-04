var express = require('express')
var app = express()
var mysql = require('mysql')

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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
			res.render('error', { title: table })

		else
		{
			columns = []
			rows = []

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
	columns = []

	db_conn.query("SHOW COLUMNS FROM " + table, function (err, result)
	{
		if (err) 
			res.render('error', { title: table })

		else
		{
			result.forEach(function(item) {
				columns.push(item.Field)
			})

			res.render('add_row', { title: 'Add New Row', table: table, columns: columns })
		}
	})
})

app.post('/insert_row', function (req, res) 
{
	table = req.body.table
	values = req.body.values

	db_conn.query("SHOW COLUMNS FROM " + table, function (err, result)
	{
		if (err) 
			res.render('error', { title: table })

		else
		{
			columns = {}

			result.forEach(function(item) 
			{
				col = {name: item.Field}

				if (item.Type.includes('int') || item.Type.includes('decimal'))
					col.type = 'number'

				else
					col.type = 'string'

				columns[col.name] = col.type
			})

			query = "INSERT INTO " + req.body.table + "("

			for (var key in values) 
				query += key + ","

			query = query.substring(0, query.length - 1)
			query += ") VALUES("

			for (var key in values) 
			{
				if (columns[key] == 'number') {
					query += values[key] + ","
				}

				else
					query += "'" + values[key] + "',"
			}

			query = query.substring(0, query.length - 1)
			query += ")"
			
			db_conn.query(query, function (err, result)
			{
				if (err) 
					res.status(400).send({ message: err })

				else
					res.status(200).send({ message: "Record was inserted" })
			})
		}
	})
})

app.post('/delete_row', function (req, res) 
{
	table = req.body.table
	values = req.body.values

	db_conn.query("SHOW COLUMNS FROM " + table, function (err, result)
	{
		columns = {}

		result.forEach(function(item) 
		{
			col = {name: item.Field}

			if (item.Type.includes('int') || item.Type.includes('decimal'))
				col.type = 'number'

			else
				col.type = 'string'

			columns[col.name] = col.type
		})

		query = "DELETE FROM " + table + " WHERE "

		for (attribute in values)
		{
			if (columns[attribute] == 'number')
				query += attribute + "=" + values[attribute] + " AND "

			else
				query += attribute + "='" + values[attribute] + "' AND "
		}

		query = query.substring(0, query.length - 5)

		db_conn.query(query, function (err, result)
		{
			if (err) 
				res.status(400).send({ message: err })

			else
				res.status(200).send({ message: "Record was deleted" })
		})
	})
})

app.get('/modify_row', function (req, res) 
{
	table = req.query.table
	columns = []
	values = {}

	db_conn.query("SHOW COLUMNS FROM " + table, function (err, result)
	{
		if (err) 
			res.render('error', { title: table })

		else
		{
			result.forEach(function(item) {
				columns.push(item.Field)
				values[item.Field] = req.query[item.Field]
			})

			res.render('modify_row', { title: 'Modify Row', table: table, columns: columns, values: values })
		}
	})
})

app.post('/update_row', function (req, res) 
{
	table = req.body.table
	old_values = req.body.old_values
	new_values = req.body.new_values

	db_conn.query("SHOW COLUMNS FROM " + table, function (err, result)
	{
		columns = {}

		result.forEach(function(item) 
		{
			col = {name: item.Field}

			if (item.Type.includes('int') || item.Type.includes('decimal'))
				col.type = 'number'

			else
				col.type = 'string'

			columns[col.name] = col.type
		})

		query = "UPDATE " + table + " SET "

		for (attribute in old_values)
		{
			if (columns[attribute] == 'number')
				query += attribute + "=" + new_values[attribute] + ","

			else
				query += attribute + "='" + new_values[attribute] + "',"
		}

		query = query.substring(0, query.length - 1)
		query += " WHERE "

		for (attribute in old_values)
		{
			if (columns[attribute] == 'number')
				query += attribute + "=" + old_values[attribute] + " AND "

			else
				query += attribute + "='" + old_values[attribute] + "' AND "
		}

		query = query.substring(0, query.length - 5)

		db_conn.query(query, function (err, result)
		{
			if (err) 
				res.status(400).send({ message: err })

			else
				res.status(200).send({ message: "Record was updated" })
		})
	})
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