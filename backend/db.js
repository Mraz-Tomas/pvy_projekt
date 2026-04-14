const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "mysqlstudenti.litv.sssvt.cz",
    user: "mraztomas",
    password: "123456",
    database: "4c2_mraztomas_db2"
});

db.connect(err => {
    if (err) throw err;
    console.log("DB connected");
});

module.exports = db;