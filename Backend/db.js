import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "maorith252043", // put your MySQL password if you have one
  database: "permission_system",
});

db.connect((err) => {
  if (err) {
    console.log(err); // shows real error
  } else {
    console.log("Database Connected");
  }
});

export default db;