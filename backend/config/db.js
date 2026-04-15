import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "mysqlstudenti.litv.sssvt.cz",
  user: "mraztomas",
  password: "123456",
  database: "4c2_mraztomas_db2"
});