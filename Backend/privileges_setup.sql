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
