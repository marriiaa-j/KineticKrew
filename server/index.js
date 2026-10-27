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
const GOALS = ["lose_weight", "toned", "bulk", "endurance", "flexibility"];
const STYLES = ["cardio", "yoga", "weights", "home"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const BARRIERS = ["motivation", "money", "time", "distance"];

app.post("/api/questionnaire", async (req, res) => {
if (!req.user) return res.status(401).json({ error: "Not logged in" });
  const userId = req.user.id;
  const b = req.body || {};

  if (!b.fitness_goal || !b.preferred_style || typeof b.has_worked_out_before !== "boolean") {
    return res.status(400).json({
      error: "fitness_goal, preferred_style and has_worked_out_before are required",
    });
  }
  if (!GOALS.includes(b.fitness_goal)) {
    return res.status(400).json({ error: `fitness_goal must be one of: ${GOALS.join(", ")}` });
  }
  if (!STYLES.includes(b.preferred_style)) {
    return res.status(400).json({ error: `preferred_style must be one of: ${STYLES.join(", ")}` });
  }

  const days = b.available_days || [];
  if (!Array.isArray(days) || !days.every((d) => DAYS.includes(d))) {
    return res.status(400).json({ error: `available_days must be a list of: ${DAYS.join(", ")}` });
  }

  const barriers = b.barriers || [];
  if (!Array.isArray(barriers) || !barriers.every((x) => BARRIERS.includes(x))) {
    return res.status(400).json({ error: `barriers must be a list of: ${BARRIERS.join(", ")}` });
  }

  if (b.athleticism_rating != null && (b.athleticism_rating < 1 || b.athleticism_rating > 10)) {
    return res.status(400).json({ error: "athleticism_rating must be between 1 and 10" });
  }

  try {
    await db.query(
      `INSERT INTO questionnaire_responses
        (userId, fitness_goal, preferred_style, hours_per_week, available_days,
         has_worked_out_before, workouts_per_week, gym_visits_per_week, minutes_per_workout,
         barriers, athleticism_rating, height_inches, weight_lbs, age, gender)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) AS new
       ON DUPLICATE KEY UPDATE
         fitness_goal = new.fitness_goal,
         preferred_style = new.preferred_style,
         hours_per_week = new.hours_per_week,
         available_days = new.available_days,
         has_worked_out_before = new.has_worked_out_before,
         workouts_per_week = new.workouts_per_week,
         gym_visits_per_week = new.gym_visits_per_week,
         minutes_per_workout = new.minutes_per_workout,
         barriers = new.barriers,
         athleticism_rating = new.athleticism_rating,
         height_inches = new.height_inches,
         weight_lbs = new.weight_lbs,
         age = new.age,
         gender = new.gender`,
      [
        userId, b.fitness_goal, b.preferred_style, b.hours_per_week ?? null,
        JSON.stringify(days), b.has_worked_out_before, b.workouts_per_week ?? null,
        b.gym_visits_per_week ?? null, b.minutes_per_workout ?? null, JSON.stringify(barriers),
        b.athleticism_rating ?? null, b.height_inches ?? null, b.weight_lbs ?? null,
        b.age ?? null, b.gender ?? null,
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
    const row = rows[0];
    row.has_worked_out_before = Boolean(row.has_worked_out_before);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load questionnaire" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});