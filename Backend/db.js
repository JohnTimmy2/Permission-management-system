import mysql from "mysql2";

const host = process.env.DB_HOST || "localhost";

const db = mysql.createConnection({
  host,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "maorith252043", // put your MySQL password if you have one
  database: process.env.DB_NAME || "permission_system",
  ssl: host !== "localhost" ? { rejectUnauthorized: false } : undefined,
});

db.connect((err) => {
  if (err) {
    console.log(err); // shows real error
  } else {
    console.log("Database Connected");
  }
});

export default db;