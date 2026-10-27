CREATE DATABASE IF NOT EXISTS kinetickrew;
USE kinetickrew;

CREATE TABLE IF NOT EXISTS exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  muscle_group VARCHAR(50) NOT NULL,
  equipment VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO exercises (name, muscle_group, equipment) VALUES
  ('Squat', 'Legs', 'Barbell'),
  ('Bench Press', 'Chest', 'Barbell'),
  ('Push-up', 'Chest', NULL),
  ('Deadlift', 'Back', 'Barbell'),
  ('Pull-up', 'Back', 'Pull-up Bar');

-- User Acct Table----
CREATE TABLE IF NOT EXISTS users (
  id              Int AUTO_INCREMENT PRIMARY KEY,
  google_id       VARCHAR(255) UNIQUE,
  email           VARCHAR(255) UNIQUE,
  username        VARCHAR(15)  UNIQUE,
  password_hash   VARCHAR(255),
  display_name    VARCHAR(2550),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

  -- ===== Questionnaire =====
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  fitness_goal VARCHAR(30) NOT NULL,
  preferred_style VARCHAR(30) NOT NULL,
  hours_per_week DECIMAL(4,1),
  available_days JSON,
  has_worked_out_before BOOLEAN NOT NULL,
  workouts_per_week TINYINT,
  gym_visits_per_week TINYINT,
  minutes_per_workout SMALLINT,
  barriers JSON,
  athleticism_rating TINYINT,
  height_inches DECIMAL(4,1),
  weight_lbs DECIMAL(5,1),
  age TINYINT,
  gender VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (athleticism_rating BETWEEN 1 AND 10),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);