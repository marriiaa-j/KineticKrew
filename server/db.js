/**
 * @file db.js
 * @module db
 * @author Angela Fernandez
 * @since 2026-10-19 (updated 2026-11-02 for cloud SSL)
 * @description Creates and exports one shared MySQL connection pool (Singleton + Object Pool).
 * Reads DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME from .env.
 * When DB_SSL=true, connects over SSL and verifies the server with ca.pem (Aiven cloud).
 * @returns {Pool} pool - use pool.query(sql, values) to run parameterized queries.
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  ssl: process.env.DB_SSL === "true"
    ? { ca: fs.readFileSync(path.join(__dirname, "ca.pem")) }
    : undefined,
});

module.exports = pool;