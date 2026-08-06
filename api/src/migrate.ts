import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const MIGRATIONS_FOLDER = path.resolve(__dirname, "../drizzle");
const JOURNAL_PATH = path.join(MIGRATIONS_FOLDER, "meta/_journal.json");

// Handles the case where the DB was previously set up via `db:push` (no Drizzle
// tracking table). Reads which migrations are already reflected in the DB by
// inspecting existing columns, then seeds the tracking table so `migrate` only
// runs the genuinely new ones.
async function baseline(pool: Pool): Promise<void> {
  // Check if the tracking table has any records. Drizzle creates the table itself
  // (even before running migrations), so checking for table existence isn't enough —
  // an empty table from a previous failed migrate attempt still needs baselining.
  let trackingHasRecords = false;
  try {
    const { rows } = await pool.query(`SELECT 1 FROM drizzle.__drizzle_migrations LIMIT 1`);
    trackingHasRecords = rows.length > 0;
  } catch {
    trackingHasRecords = false;
  }
  if (trackingHasRecords) return;

  const { rows: entriesExists } = await pool.query(`
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'entries'
  `);
  if (entriesExists.length === 0) return;

  console.log("Detected untracked schema — baselining Drizzle migrations...");

  const { rows: columnRows } = await pool.query(`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'entries'
  `);
  const existingColumns = new Set(columnRows.map((r: { column_name: string }) => r.column_name));

  const journal = JSON.parse(fs.readFileSync(JOURNAL_PATH, "utf-8"));

  await pool.query(`CREATE SCHEMA IF NOT EXISTS drizzle`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash TEXT NOT NULL,
      created_at BIGINT
    )
  `);

  let count = 0;
  for (const entry of journal.entries) {
    const migrationPath = path.join(MIGRATIONS_FOLDER, `${entry.tag}.sql`);
    const content = fs.readFileSync(migrationPath, "utf-8");

    // Determine whether this migration is already reflected in the DB.
    const addColumnMatch = content.match(/ADD COLUMN "(\w+)"/);
    const createsTable = /CREATE TABLE/.test(content);

    const isApplied = createsTable
      ? true // entries table exists (checked above)
      : addColumnMatch
        ? existingColumns.has(addColumnMatch[1])
        : false;

    if (!isApplied) break;

    const hash = crypto.createHash("sha256").update(content).digest("hex");
    await pool.query(
      `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`,
      [hash, entry.when],
    );
    count++;
  }

  if (count > 0) console.log(`Baselined ${count} migration(s).`);
}

// Applies any pending Drizzle migrations from ./drizzle to the database in
// DATABASE_URL, then exits. Run automatically via `yarn dev` and Render's
// startCommand so migrations always run before the server starts.
async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const db = drizzle(pool);
  await baseline(pool);
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  await pool.end();
  console.log("Migrations applied.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
