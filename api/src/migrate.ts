import "dotenv/config";
import path from "path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

// Applies any pending Drizzle migrations from ./drizzle to the database in
// DATABASE_URL, then exits. Run automatically as Render's preDeployCommand, so
// migrations always target the same database the API uses — no manual step, no
// wrong-branch risk. Uses only runtime deps (drizzle-orm + pg), not drizzle-kit.
async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: path.resolve(__dirname, "../drizzle") });
  await pool.end();
  console.log("Migrations applied.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
