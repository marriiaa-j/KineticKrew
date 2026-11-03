// Prints a table from the database, one card per row: npm run db:show -- users
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const TABLES = ["users", "exercises", "questionnaire_responses"];
const HIDDEN = ["password_hash", "google_id"];
const table = process.argv[2] || "questionnaire_responses";

if (!TABLES.includes(table)) {
  console.log(`Pick one of: ${TABLES.join(", ")}`);
  process.exit(1);
}

function format(value) {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (value instanceof Date) return value.toLocaleString();
  return String(value);
}

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    decimalNumbers: true,
    ssl: process.env.DB_SSL === "true"
      ? { ca: fs.readFileSync(path.join(__dirname, "..", "ca.pem")) }
      : undefined,
  });

  const [rows] = await conn.query(`SELECT * FROM ${table}`);
  console.log(`\n${table}: ${rows.length} row(s)\n`);

  rows.forEach((row, i) => {
    console.log(`── Row ${i + 1} ${"─".repeat(30)}`);
    const keys = Object.keys(row).filter((k) => !HIDDEN.includes(k));
    const width = Math.max(...keys.map((k) => k.length));
    for (const key of keys) {
      console.log(`  ${key.padEnd(width)}  ${format(row[key])}`);
    }
    console.log();
  });

  await conn.end();
})().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});