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

app.post("/api/exercises", async (req, res) => {
  const { name, muscle_group, equipment } = req.body || {};

  if (!name || !muscle_group) {
    return res.status(400).json({ error: "name and muscle_group are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO exercises (name, muscle_group, equipment) VALUES (?, ?, ?)",
      [name, muscle_group, equipment || null]
    );

    const [rows] = await db.query("SELECT * FROM exercises WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "An exercise with that name already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to add exercise" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});