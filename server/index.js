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
    const [rows] = await db.query("SELECT * FROM exercises ORDER BY name");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load exercises" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});