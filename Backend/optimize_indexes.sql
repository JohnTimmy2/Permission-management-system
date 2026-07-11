-- ============================================================
--  Permission Request Management System — QUERY OPTIMIZATION
--  Run this ONCE (as root/admin) after database_setup.sql.
--
--  These indexes target columns that server.js actually filters,
--  joins, or sorts on but that had no index before:
--    - requests.status            (dashboards filter by status)
--    - requests.created_at        (GET /requests orders by this)
--    - requests(student_id,status) (student-requests + mark-viewed)
--    - groups_table.group_name    (looked up by name on every
--                                   student user create/edit)
--    - lecturer_assignments(subject_name, group_name)
--                                  (looked up together when routing
--                                   a new request's Telegram notification)
-- ============================================================

USE permission_system;

ALTER TABLE requests
  ADD INDEX idx_status (status),
  ADD INDEX idx_created_at (created_at),
  ADD INDEX idx_student_status (student_id, status);

ALTER TABLE groups_table
  ADD INDEX idx_group_name (group_name);

ALTER TABLE lecturer_assignments
  ADD INDEX idx_subject_group (subject_name, group_name);
