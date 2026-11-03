// Runs schema.sql against the database set in server/.env
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true"
      ? { ca: fs.readFileSync(path.join(__dirname, "..", "ca.pem")) }
      : undefined,
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await conn.query(sql);

  const [tables] = await conn.query("SHOW TABLES FROM kinetickrew");
  console.log("Tables:", tables.map((t) => Object.values(t)[0]).join(", "));
  await conn.end();
})().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});