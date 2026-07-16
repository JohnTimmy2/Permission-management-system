-- ============================================================
--  Permission Request Management System — DATABASE USER PRIVILEGES
--  Run this ONCE (as root/admin) after database_setup.sql has created the schema.
--
--  Principle of least privilege: the app currently connects as `root`,
--  which can DROP or ALTER any table. That's far more power than the
--  app actually needs — it only ever reads and writes rows, it never
--  changes table structure at runtime. This script creates a dedicated
--  `app_user` that can only SELECT / INSERT / UPDATE / DELETE on the
--  permission_system database, and nothing else (no DROP, no ALTER,
--  no CREATE, no GRANT OPTION, no access to any other database).
--
--  After running this, update DB_USER / DB_PASSWORD in .env (or the
--  hosting provider's env vars) to use 'app_user' instead of 'root'.
-- ============================================================

CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'ChangeMe_AppUser2026!';

GRANT SELECT, INSERT, UPDATE, DELETE ON permission_system.* TO 'app_user'@'%';

-- Explicitly does NOT grant: DROP, ALTER, CREATE, INDEX, GRANT OPTION,
-- or any privilege on other databases. A connection using this account
-- cannot change the schema or touch data outside permission_system.

FLUSH PRIVILEGES;

-- ---- Proof-of-concept queries to run during the presentation ----
-- 1) Connect as the restricted user:
--      mysql -u app_user -p permission_system
-- 2) This works (within granted privileges):
--      SELECT * FROM users LIMIT 1;
-- 3) This fails with "Access denied" (outside granted privileges):
--      DROP TABLE users;


-- ============================================================
--  ROLE-TIERED DATABASE USERS  (demonstration accounts)
--
--  The live app connects as the single `app_user` above — that's the
--  correct, standard pattern for a web app (the backend is the only
--  thing that ever talks to MySQL; end users never connect directly).
--
--  These three extra accounts exist to demonstrate GRANT-based
--  privilege tiering that mirrors the app's three roles, at the
--  table/column level (the finest grain MySQL's GRANT system offers —
--  it cannot restrict access to a single row, e.g. "only this
--  student's own requests"; that row-level filtering is still enforced
--  by the backend's WHERE clauses and JWT role checks). They are NOT
--  wired into the running app — they're for live proof-of-concept
--  queries during the DB presentation only.
-- ============================================================

-- ---- student_db_user: narrowest — only what a student directly needs ----
CREATE USER IF NOT EXISTS 'student_db_user'@'%' IDENTIFIED BY 'ChangeMe_Student2026!';
GRANT SELECT, INSERT, UPDATE ON permission_system.requests TO 'student_db_user'@'%';
GRANT SELECT ON permission_system.subjects TO 'student_db_user'@'%';
GRANT SELECT ON permission_system.groups_table TO 'student_db_user'@'%';
GRANT SELECT ON permission_system.student_groups TO 'student_db_user'@'%';
-- No access at all to users, lecturer_assignments, password_resets,
-- telegram_notifications. No DELETE anywhere.

-- ---- lecturer_db_user: review/decide, read-heavy, no request creation ----
CREATE USER IF NOT EXISTS 'lecturer_db_user'@'%' IDENTIFIED BY 'ChangeMe_Lecturer2026!';
GRANT SELECT, UPDATE ON permission_system.requests TO 'lecturer_db_user'@'%';
GRANT SELECT ON permission_system.users TO 'lecturer_db_user'@'%';
GRANT SELECT ON permission_system.lecturer_assignments TO 'lecturer_db_user'@'%';
GRANT SELECT ON permission_system.groups_table TO 'lecturer_db_user'@'%';
GRANT SELECT ON permission_system.subjects TO 'lecturer_db_user'@'%';
-- No INSERT on requests (lecturers don't submit requests), no DELETE,
-- no write access to users.

-- ---- admin_db_user: full CRUD on app data, still no schema power ----
CREATE USER IF NOT EXISTS 'admin_db_user'@'%' IDENTIFIED BY 'ChangeMe_Admin2026!';
GRANT SELECT, INSERT, UPDATE, DELETE ON permission_system.* TO 'admin_db_user'@'%';
-- Same table-data breadth as app_user, but still explicitly no DROP,
-- ALTER, CREATE, or GRANT OPTION — even the admin role doesn't get
-- schema-changing power at the database level. Defense-in-depth: a
-- compromised admin session still can't drop a table.

FLUSH PRIVILEGES;

-- ---- Proof-of-concept queries for the tiered accounts ----
-- 1) mysql -u student_db_user -p permission_system
--      SELECT * FROM requests LIMIT 1;      -- works
--      SELECT * FROM users;                 -- Access denied
--      DELETE FROM requests WHERE request_id = 1;  -- Access denied (no DELETE)
-- 2) mysql -u lecturer_db_user -p permission_system
--      SELECT * FROM users LIMIT 1;         -- works (read-only)
--      INSERT INTO requests (...) VALUES (...);    -- Access denied (no INSERT)
-- 3) mysql -u admin_db_user -p permission_system
--      DELETE FROM requests WHERE request_id = 999; -- works
--      DROP TABLE requests;                 -- Access denied (no DROP)
