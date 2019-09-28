const sqlite3 = require('sqlite3').verbose()
const dbPath =  process.env['node_path'] + '/db/db.sqlite'
console.log(dbPath)
// const dbPath = ':memory:'
const db = new sqlite3.Database(dbPath, (err) => {
	if (err) {
		console.error(err.message)
		throw err
	}
	console.info('Connected to sqlite database')
})

exports.db = db
