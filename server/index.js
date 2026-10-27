require("dotenv").config();
const db = require("./db");

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;
const setupAuth = require("./auth")
app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(express.json());
setupAuth(app);

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


// ===== Questionnaire =====
// These must match the values in Questionnaire.js and FitnessQuestions.js exactly
const SEXES = ["Female", "Male"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const GOALS = ["Flexibility", "Build muscle", "Lose weight", "Endurance", "Bulk", "Toned"];
const DAYS_PER_WEEK = ["1–2 days", "3–4 days", "5–7 days"];
const PREFERENCES = ["Cardio", "Yoga", "Weight machines", "At-Home workouts"];
const BARRIERS = [
  "Motivation", "Money", "Time", "Distance", "Lack of equipment",
  "Lack of Knowledge", "Health Concerns", "Confidence", "Priorities",
];

function checkOne(value, allowed, field) {
  if (value == null || value === "") return null;
  return allowed.includes(value) ? null : `${field} must be one of: ${allowed.join(", ")}`;
}

function checkList(value, allowed, field) {
  if (value == null) return null;
  if (!Array.isArray(value) || !value.every((v) => allowed.includes(v))) {
    return `${field} must be a list of: ${allowed.join(", ")}`;
  }
  return null;
}

app.post("/api/questionnaire", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  const userId = req.user.id;
  const b = req.body || {};

  const error =
    checkOne(b.sex, SEXES, "sex") ||
    checkOne(b.fitness_level, LEVELS, "fitness_level") ||
    checkOne(b.days_per_week, DAYS_PER_WEEK, "days_per_week") ||
    checkList(b.fitness_goals, GOALS, "fitness_goals") ||
    checkList(b.workout_preferences, PREFERENCES, "workout_preferences") ||
    checkList(b.barriers, BARRIERS, "barriers");
  if (error) return res.status(400).json({ error });

  if (b.age != null && b.age < 13) {
    return res.status(400).json({ error: "You must be 13 or older" });
  }

  try {
    await db.query(
      `INSERT INTO questionnaire_responses
        (user_id, sex, age, height_inches, weight_lbs, fitness_level,
         fitness_goals, days_per_week, workout_preferences, barriers)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) AS new
       ON DUPLICATE KEY UPDATE
         sex = new.sex,
         age = new.age,
         height_inches = new.height_inches,
         weight_lbs = new.weight_lbs,
         fitness_level = new.fitness_level,
         fitness_goals = new.fitness_goals,
         days_per_week = new.days_per_week,
         workout_preferences = new.workout_preferences,
         barriers = new.barriers`,
      [
        userId,
        b.sex || null,
        b.age ?? null,
        b.height_inches ?? null,
        b.weight_lbs ?? null,
        b.fitness_level || null,
        JSON.stringify(b.fitness_goals || []),
        b.days_per_week || null,
        JSON.stringify(b.workout_preferences || []),
        JSON.stringify(b.barriers || []),
      ]
    );

    const [rows] = await db.query("SELECT * FROM questionnaire_responses WHERE user_id = ?", [userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save questionnaire" });
  }
});

app.get("/api/questionnaire/me", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  try {
    const [rows] = await db.query("SELECT * FROM questionnaire_responses WHERE user_id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No questionnaire found for this user" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load questionnaire" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});