-- ============================================================
--  Permission Request Management System — FULL DATABASE SETUP
--  Run this ONCE in MySQL Workbench to create everything.
--  ⚠ WARNING: this drops existing tables. Only run on a fresh setup.
-- ============================================================

CREATE DATABASE IF NOT EXISTS permission_system;
USE permission_system;

-- Drop in child-first order so foreign keys don't block the drop
DROP TABLE IF EXISTS telegram_notifications;
DROP TABLE IF EXISTS lecturer_assignments;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS student_groups;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS groups_table;
DROP TABLE IF EXISTS subjects;

-- ============================================================
--  USERS  (IDs are entered manually, e.g. 260101)
-- ============================================================
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'lecturer', 'admin') NOT NULL,
    telegram_chat_id VARCHAR(50) DEFAULT NULL
);

INSERT INTO users (user_id, name, email, password, role) VALUES
(260101, 'Ly Heng', 'maorith252043@gmail.com', '123456', 'student'),
(123456, 'dara', 'dara@test.com', '123', 'student'),
(100201, 'Lecturer One', 'lecturer@test.com', '123456', 'lecturer'),
(100202, 'Lecturer Two', 'lecturer2@test.com', '123456', 'lecturer'),
(100203, 'Lecturer Three', 'lecturer3@test.com', '123456', 'lecturer'),
(100301, 'Admin One', 'admin@test.com', '123456', 'admin');

-- ============================================================
--  GROUPS
-- ============================================================
CREATE TABLE groups_table (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(50) NOT NULL
);

INSERT INTO groups_table (group_name) VALUES
('SE Group 1'),
('SE Group 2'),
('SE Group 3'),
('SE Group 4');

-- ============================================================
--  STUDENT  <->  GROUP  MAPPING
-- ============================================================
CREATE TABLE student_groups (
    mapping_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    group_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups_table(group_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_assignment (student_id)
);

INSERT INTO student_groups (student_id, group_id) VALUES
(260101, 1),
(123456, 2);

-- ============================================================
--  SUBJECTS
--  (Not currently wired into the app's request/assignment logic —
--   those use free-text subject names instead — kept for completeness.)
-- ============================================================
CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL
);

INSERT INTO subjects (subject_name) VALUES
('Database System'),
('Web Development'),
('HCI');

-- ============================================================
--  REQUESTS
--  (status_viewed, proof_image_url, reject_reason, term all built in)
-- ============================================================
CREATE TABLE requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    student_name VARCHAR(100),
    group_id INT,
    group_name VARCHAR(100),
    subject_id INT,
    subject_name VARCHAR(100),
    teacher_name VARCHAR(100),
    reason TEXT NOT NULL,
    request_date DATE NOT NULL,
    class_time VARCHAR(100) NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
    proof_image_url VARCHAR(500) DEFAULT NULL,
    reject_reason TEXT DEFAULT NULL,
    status_viewed TINYINT(1) DEFAULT 0,
    term VARCHAR(20) DEFAULT 'Term 1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups_table(group_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- ============================================================
--  PASSWORD RESETS  (forgot-password flow)
-- ============================================================
CREATE TABLE password_resets (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================
--  LECTURER ASSIGNMENTS
--  Ties each lecturer to the subjects they teach.
--  A lecturer only sees requests that match their assigned subjects.
-- ============================================================
CREATE TABLE lecturer_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id INT NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (lecturer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Lecturer One (100201) teaches Database and React to SE Group 1
INSERT INTO lecturer_assignments (lecturer_id, subject_name, group_name) VALUES
(100201, 'Database', 'SE Group 1'),
(100201, 'React', 'SE Group 1'),
(100202, 'Networking', 'SE Group 1'),
(100202, 'Networking', 'SE Group 2'),
(100202, 'Networking', 'SE Group 3'),
(100202, 'Networking', 'SE Group 4'),
(100202, 'Cloud Computing', 'SE Group 1'),
(100202, 'Cloud Computing', 'SE Group 2'),
(100202, 'Cloud Computing', 'SE Group 3'),
(100202, 'Cloud Computing', 'SE Group 4'),
(100203, 'DevOps', 'SE Group 1'),
(100203, 'DevOps', 'SE Group 2'),
(100203, 'DevOps', 'SE Group 3'),
(100203, 'DevOps', 'SE Group 4'),
(100203, 'Blockchain', 'SE Group 1'),
(100203, 'Blockchain', 'SE Group 2'),
(100203, 'Blockchain', 'SE Group 3'),
(100203, 'Blockchain', 'SE Group 4');

-- ============================================================
--  TELEGRAM NOTIFICATIONS
--  Tracks which Telegram message belongs to which request, so
--  editing a request can delete the old notification and send a
--  fresh one instead of leaving a stale message behind.
-- ============================================================
CREATE TABLE telegram_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    chat_id VARCHAR(50) NOT NULL,
    message_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_request_id (request_id)
);

-- ============================================================
--  Quick check — verify everything got created
-- ============================================================
SELECT * FROM users;
SELECT * FROM groups_table;
SELECT * FROM student_groups;
SELECT * FROM subjects;
SELECT * FROM requests;
SELECT * FROM password_resets;
SELECT * FROM lecturer_assignments;
SELECT * FROM telegram_notifications;
