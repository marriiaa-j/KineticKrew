require("dotenv").config();
const db = require("./db");

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "KineticKrew backend is running" });
});

app.get("/api/exercises", async (req, res) => {
  try {
    const { muscle } = req.query;
    let sql = "SELECT * FROM exercises";
    const params = [];

    if (muscle) {
      sql += " WHERE muscle_group = ?";
      params.push(muscle);
    }

    sql += " ORDER BY name";
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load exercises" });
  }
});

app.get("/api/exercises/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM exercises WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load exercise" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});