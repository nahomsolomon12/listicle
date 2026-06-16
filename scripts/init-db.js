import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closePool, pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, "..", "db", "schema.sql");

try {
  const schema = await readFile(schemaPath, "utf8");
  await pool.query(schema);
  console.log("Database schema is ready.");
} catch (error) {
  console.error("Unable to initialize database schema.");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
