import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const ssl =
  process.env.DATABASE_URL || process.env.PGSSLMODE === "require"
    ? { rejectUnauthorized: false }
    : undefined;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
});

export async function closePool() {
  await pool.end();
}
