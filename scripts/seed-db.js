import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closePool, pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "business.json");

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

try {
  const items = JSON.parse(await readFile(dataPath, "utf8"));

  for (const item of items) {
    await pool.query(
      `
        INSERT INTO business_items
          (title, slug, text, category, image, submitted_by)
        VALUES
          ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          text = EXCLUDED.text,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          submitted_by = EXCLUDED.submitted_by
      `,
      [
        item.title,
        slugify(item.title),
        item.text,
        item.category,
        item.image,
        item.submittedBy,
      ],
    );
  }

  console.log(`Seeded ${items.length} business items.`);
} catch (error) {
  console.error("Unable to seed business items.");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
