DROP DATABASE IF EXISTS gym;
CREATE DATABASE IF NOT EXISTS gym
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;USE gym;

CREATE TABLE `User` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    registration_date DATETIME,
    status ENUM('active', 'inactive') DEFAULT 'active'
) ENGINE=InnoDB;

CREATE TABLE Athlete (
    athlete_id INT PRIMARY KEY,
    sports_branch VARCHAR(100),
    CONSTRAINT fk_athlete_user
        FOREIGN KEY (athlete_id) REFERENCES `User`(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Staff (
    staff_id INT PRIMARY KEY,
    hire_date DATE,
    salary DECIMAL(10,2),
    employment_type ENUM('full-time', 'part-time') NOT NULL,
    CONSTRAINT fk_staff_user
        FOREIGN KEY (staff_id) REFERENCES `User`(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Trainer (
    trainer_id INT PRIMARY KEY,
    specialization VARCHAR(100),
    experience_years INT,
    CONSTRAINT fk_trainer_staff
        FOREIGN KEY (trainer_id) REFERENCES Staff(staff_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Medical (
    medical_id INT PRIMARY KEY,
    profession ENUM('doctor', 'physiotherapist', 'dietitian') NOT NULL,
    specialization_area VARCHAR(100),
    CONSTRAINT fk_medical_staff
        FOREIGN KEY (medical_id) REFERENCES Staff(staff_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE TrainingProgram (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(150) NOT NULL,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
    goal TEXT,
    start_date DATE,
    end_date DATE,
    created_by_trainer INT,
    CONSTRAINT fk_program_trainer
        FOREIGN KEY (created_by_trainer) REFERENCES Trainer(trainer_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ProgramEnrollment (
    athlete_id INT,
    program_id INT,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    completion_status ENUM('ongoing', 'completed', 'dropped') DEFAULT 'ongoing',
    PRIMARY KEY (athlete_id, program_id),
    CONSTRAINT fk_enrollment_athlete
        FOREIGN KEY (athlete_id) REFERENCES Athlete(athlete_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_enrollment_program
        FOREIGN KEY (program_id) REFERENCES TrainingProgram(program_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE WorkoutSession (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    session_date DATE NOT NULL,
    duration INT,
    intensity_level ENUM('low', 'medium', 'high'),
    CONSTRAINT fk_session_program
        FOREIGN KEY (program_id) REFERENCES TrainingProgram(program_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Exercise (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_name VARCHAR(150) NOT NULL,
    type VARCHAR(100),
    equipment_required VARCHAR(100),
    difficulty ENUM('easy', 'medium', 'hard')
) ENGINE=InnoDB;

CREATE TABLE SessionExercise (
    session_id INT NOT NULL,
    exercise_id INT NOT NULL,
    planned_sets INT,
    planned_reps INT,
    rest_duration INT,
    PRIMARY KEY (session_id, exercise_id),
    CONSTRAINT fk_se_session
        FOREIGN KEY (session_id) REFERENCES WorkoutSession(session_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_se_exercise
        FOREIGN KEY (exercise_id) REFERENCES Exercise(exercise_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE PerformanceLog (
    athlete_id INT NOT NULL,
    session_id INT NOT NULL,
    exercise_id INT NOT NULL,
    completed_sets INT,
    completed_reps INT,
    weight_used DECIMAL(6,2),
    perceived_exertion INT,
    log_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (athlete_id, session_id, exercise_id),
    CONSTRAINT fk_log_athlete
        FOREIGN KEY (athlete_id) REFERENCES Athlete(athlete_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_log_session_exercise
        FOREIGN KEY (session_id, exercise_id)
        REFERENCES SessionExercise(session_id, exercise_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE BodyMeasurement (
    athlete_id INT,
    measurement_date DATE,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    body_fat_percentage DECIMAL(5,2),
    muscle_mass DECIMAL(5,2),
    bmi DECIMAL(5,2),
    PRIMARY KEY (athlete_id, measurement_date),
    CONSTRAINT fk_body_athlete
        FOREIGN KEY (athlete_id) REFERENCES Athlete(athlete_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE MedicalAssessment (
    athlete_id INT,
    medical_id INT,
    assessment_date DATE,
    assessment_type VARCHAR(100),
    notes TEXT,
    clearance_status ENUM('cleared', 'restricted', 'not_cleared'),
    PRIMARY KEY (athlete_id, medical_id, assessment_date),
    CONSTRAINT fk_ma_athlete
        FOREIGN KEY (athlete_id) REFERENCES Athlete(athlete_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_ma_medical
        FOREIGN KEY (medical_id) REFERENCES Medical(medical_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE TrainerFeedback (
    trainer_id INT,
    athlete_id INT,
    session_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    PRIMARY KEY (trainer_id, athlete_id, session_id),
    CONSTRAINT fk_feedback_trainer
        FOREIGN KEY (trainer_id) REFERENCES Trainer(trainer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_feedback_athlete
        FOREIGN KEY (athlete_id) REFERENCES Athlete(athlete_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_feedback_session
        FOREIGN KEY (session_id) REFERENCES WorkoutSession(session_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE OR REPLACE VIEW v_log_enriched AS
SELECT
  pl.athlete_id,
  pl.session_id,
  ws.program_id,
  ws.session_date,
  pl.exercise_id,
  e.exercise_name,
  e.type,
  e.equipment_required,
  e.difficulty,
  pl.completed_sets,
  pl.completed_reps,
  pl.weight_used,
  pl.perceived_exertion,
  pl.log_time
FROM PerformanceLog pl
JOIN WorkoutSession ws ON ws.session_id = pl.session_id
JOIN Exercise e ON e.exercise_id = pl.exercise_id;