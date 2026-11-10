// View database tables. Run from the server folder:
//   npm run db:show -- answers          (cards in the terminal)
//   npm run db:show -- answers --csv    (saves server/exports/answers.csv for Excel)
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const QUERIES = {
  users: "SELECT * FROM users",
  exercises: "SELECT * FROM exercises",
  questionnaire_responses: "SELECT * FROM questionnaire_responses",
  answers: `
    SELECT u.email, u.display_name,
           q.sex, q.age, q.height_inches, q.weight_lbs, q.fitness_level,
           q.fitness_goals, q.days_per_week, q.workout_preferences, q.barriers,
           q.updated_at
    FROM questionnaire_responses q
    JOIN users u ON u.id = q.user_id
    ORDER BY q.updated_at DESC`,
};
const HIDDEN = ["password_hash", "google_id"];

const args = process.argv.slice(2);
const table = args.find((a) => !a.startsWith("--")) || "questionnaire_responses";
const asCsv = args.includes("--csv");

if (!QUERIES[table]) {
  console.log(`Pick one of: ${Object.keys(QUERIES).join(", ")}`);
  process.exit(1);
}

function format(value) {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (value instanceof Date) return value.toLocaleString();
  return String(value);
}

function csvCell(value) {
  let text = value === null || value === undefined ? "" : format(value);
  if (text === "—") text = "";
  return `"${text.replace(/"/g, '""')}"`;
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

  const [rows] = await conn.query(QUERIES[table]);
  await conn.end();

  if (asCsv) {
    const columns = Object.keys(rows[0] || {}).filter((c) => !HIDDEN.includes(c));
    const lines = [
      columns.join(","),
      ...rows.map((row) => columns.map((c) => csvCell(row[c])).join(",")),
    ];

    const folder = path.join(__dirname, "..", "exports");
    fs.mkdirSync(folder, { recursive: true });
    const file = path.join(folder, `${table}.csv`);
    fs.writeFileSync(file, "\uFEFF" + lines.join("\r\n"));

    console.log(`Saved ${rows.length} row(s) to ${file}`);
    return;
  }

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
})().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});