const mysql = require('mysql');

const db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1143214',
  database : 'test',
  port : '3307'
});

db.connect();

module.exports = db;