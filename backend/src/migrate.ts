import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "./database.js";

const migrationsDirectory = fileURLToPath(
  new URL("../database/migrations/", import.meta.url),
);

const migrationFilePattern = /^\d{3}_[a-z0-9_]+\.sql$/;

function checksum(contents: string): string {
  return createHash("sha256").update(contents).digest("hex");
}

async function migrate(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query(
      "SELECT pg_advisory_lock(hashtext('logistics_tracker_migrations'))",
    );

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        checksum TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const filenames = (await readdir(migrationsDirectory))
      .filter((filename) => migrationFilePattern.test(filename))
      .sort();

    const appliedResult = await client.query<{
      filename: string;
      checksum: string;
    }>("SELECT filename, checksum FROM schema_migrations");

    const appliedMigrations = new Map(
      appliedResult.rows.map((migration) => [
        migration.filename,
        migration.checksum,
      ]),
    );

    const availableMigrations = new Set(filenames);
    for (const filename of appliedMigrations.keys()) {
      if (!availableMigrations.has(filename)) {
        throw new Error(`Applied migration file is missing: ${filename}`);
      }
    }

    let pendingMigrationFound = false;

    for (const filename of filenames) {
      const sql = await readFile(`${migrationsDirectory}/${filename}`, "utf8");
      const fileChecksum = checksum(sql);
      const appliedChecksum = appliedMigrations.get(filename);

      if (appliedChecksum && appliedChecksum !== fileChecksum) {
        throw new Error(`Applied migration has changed: ${filename}`);
      }

      if (appliedChecksum) {
        if (pendingMigrationFound) {
          throw new Error(`Migration was applied out of order: ${filename}`);
        }

        console.log(`Already applied: ${filename}`);
        continue;
      }

      pendingMigrationFound = true;

      console.log(`Applying: ${filename}`);
      await client.query("BEGIN");

      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)",
          [filename, fileChecksum],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Database migrations are up to date.");
  } finally {
    await client.query(
      "SELECT pg_advisory_unlock(hashtext('logistics_tracker_migrations'))",
    );
    client.release();
    await pool.end();
  }
}

try {
  await migrate();
} catch (error) {
  console.error("Migration failed", error);
  process.exitCode = 1;
}
