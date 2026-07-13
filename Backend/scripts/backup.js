import "dotenv/config";
import { spawnSync } from "child_process";
import { mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupsDir = path.join(__dirname, "..", "backups");

if (!existsSync(backupsDir)) mkdirSync(backupsDir, { recursive: true });

const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || "3306";
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "permission_system";

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outFile = path.join(backupsDir, `${database}-${timestamp}.sql`);

const args = [
  `-h${host}`,
  `-P${port}`,
  `-u${user}`,
  password ? `-p${password}` : null,
  "--single-transaction",
  "--routines",
  "--result-file=" + outFile,
  database,
].filter(Boolean);

console.log(`Backing up "${database}" from ${host}:${port} to:\n  ${outFile}`);

const result = spawnSync("mysqldump", args, { stdio: "inherit" });

if (result.error) {
  console.error("Backup failed to start — is mysqldump installed and on PATH?", result.error.message);
  process.exit(1);
}
if (result.status !== 0) {
  console.error(`mysqldump exited with code ${result.status}`);
  process.exit(result.status);
}

console.log("Backup complete.");
