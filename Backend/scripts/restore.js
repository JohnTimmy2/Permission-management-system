import "dotenv/config";
import { spawnSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupsDir = path.join(__dirname, "..", "backups");

const fileArg = process.argv[2];
if (!fileArg) {
  console.error("Usage: node restore.js <dump-file.sql>  (path relative to Backend/backups, or absolute)");
  process.exit(1);
}

const dumpFile = path.isAbsolute(fileArg) ? fileArg : path.join(backupsDir, fileArg);
if (!existsSync(dumpFile)) {
  console.error(`Dump file not found: ${dumpFile}`);
  process.exit(1);
}

const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || "3306";
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.RESTORE_DB_NAME || process.env.DB_NAME || "permission_system";

const args = [
  `-h${host}`,
  `-P${port}`,
  `-u${user}`,
  password ? `-p${password}` : null,
  database,
].filter(Boolean);

console.log(`Restoring ${dumpFile}\n  into "${database}" on ${host}:${port}`);
console.log("Set RESTORE_DB_NAME to a scratch database name to avoid overwriting the real one.");

const sql = readFileSync(dumpFile);
const run = spawnSync("mysql", args, { input: sql, stdio: ["pipe", "inherit", "inherit"] });

if (run.error) {
  console.error("Restore failed to start — is the mysql CLI installed and on PATH?", run.error.message);
  process.exit(1);
}
if (run.status !== 0) {
  console.error(`mysql exited with code ${run.status}`);
  process.exit(run.status);
}

console.log("Restore complete.");
