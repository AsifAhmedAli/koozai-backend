const mysql = require("mysql");
require("dotenv").config();
// const connection = () => {
const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.pass,
  database: process.env.dbname,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected to DB!");
});
// };

module.exports = db;
