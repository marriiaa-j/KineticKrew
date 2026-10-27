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
  sex VARCHAR(10),
  age TINYINT UNSIGNED,
  height_inches DECIMAL(4,1),
  weight_lbs DECIMAL(5,1),
  fitness_level VARCHAR(20),
  fitness_goals JSON,
  days_per_week VARCHAR(20),
  workout_preferences JSON,
  barriers JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (age >= 13),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);