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