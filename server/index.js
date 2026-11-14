/**
 * @file index.js
 * @module server
 * @author Angela Fernandez (exercise and questionnaire routes); Citlalli Martinez (auth integration)
 * @since 2026-10-19
 * @description Main Express server on port 4000. Sets up CORS and JSON parsing,
 * loads Google sign-in (setupAuth), and defines the REST API routes for exercises and the questionnaire.
 */

require("dotenv").config({ path: require("path").join(__dirname, ".env") });
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

/**
 * Lists exercises, optionally filtered by muscle group, sorted by name.
 * @route GET /api/exercises
 * @param {string} [req.query.muscle] - e.g. "Chest"
 * @returns {Object[]} 200 - list of exercises
 */

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

/**
 * Returns one exercise by its id.
 * @route GET /api/exercises/:id
 * @returns {Object} 200 - the exercise | 404 - { error } if not found
 */
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

/**
 * Adds a new exercise.
 * @route POST /api/exercises
 * @param {Object} req.body - name (required), muscle_group (required), equipment (optional)
 * @returns {Object} 201 - the new exercise | 400 - missing fields | 409 - name already exists
 */

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

/**
 * Checks that a single answer is one of the allowed values. Empty answers are allowed.
 * @param {string} value - the answer sent by the frontend
 * @param {string[]} allowed - list of valid answers
 * @param {string} field - field name, used in the error message
 * @returns {string|null} an error message, or null if the answer is valid
 */

function checkOne(value, allowed, field) {
  if (value == null || value === "") return null;
  return allowed.includes(value) ? null : `${field} must be one of: ${allowed.join(", ")}`;
}

/**
 * Checks that every item in a "choose all that apply" answer is an allowed value.
 * @param {string[]} value - list of answers sent by the frontend
 * @param {string[]} allowed - list of valid answers
 * @param {string} field - field name, used in the error message
 * @returns {string|null} an error message, or null if all answers are valid
 */

function checkList(value, allowed, field) {
  if (value == null) return null;
  if (!Array.isArray(value) || !value.every((v) => allowed.includes(v))) {
    return `${field} must be a list of: ${allowed.join(", ")}`;
  }
  return null;
}

/**
 * Saves or updates the logged-in user's questionnaire answers (upsert: one row per user).
 * @route POST /api/questionnaire
 * @param {Object} req.body - sex, age, height_inches, weight_lbs, fitness_level,
 *   fitness_goals[], days_per_week, workout_preferences[], barriers[] (all optional)
 * @returns {Object} 200 - the saved questionnaire row
 * @returns {Object} 400 - { error } if an answer is not an allowed value or age < 13
 * @returns {Object} 401 - { error } if the user is not logged in
 * @returns {Object} 500 - { error } if the database query fails
 */

app.post("/api/questionnaire", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  const user_id = req.user.id;
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
        user_id,
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

    const [rows] = await db.query("SELECT * FROM questionnaire_responses WHERE user_id = ?", [user_id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save questionnaire" });
  }
});

/**
 * Returns the logged-in user's saved questionnaire answers.
 * @route GET /api/questionnaire/me
 * @returns {Object} 200 - the user's questionnaire row
 * @returns {Object} 401 - { error } if not logged in
 * @returns {Object} 404 - { error } if the user has not filled out the questionnaire
 */

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