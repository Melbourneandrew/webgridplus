// @vitest-environment node
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const databases: Database.Database[] = [];
const migration = fs.readFileSync(
  path.join(process.cwd(), "src/infrastructure/db/migrations/0001_init.sql"),
  "utf8",
);

afterEach(() => {
  databases.splice(0).forEach((database) => database.close());
});

describe("initial database migration", () => {
  it("creates the complete application schema", () => {
    const database = new Database(":memory:");
    databases.push(database);
    database.exec(migration);

    const tables = database
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
      .all() as Array<{ name: string }>;

    expect(tables.map(({ name }) => name)).toEqual([
      "game_types",
      "played_games",
      "profile_stats",
      "profiles",
      "sessions",
      "users",
    ]);
  });

  it("is idempotent and enforces canonical uniqueness constraints", () => {
    const database = new Database(":memory:");
    databases.push(database);
    database.exec(migration);
    expect(() => database.exec(migration)).not.toThrow();

    const insert = database.prepare(
      "INSERT INTO game_types (type_name, duration_seconds, grid_cell_count, created_at) VALUES (?, ?, ?, ?)",
    );
    insert.run("regular", 60, 900, Date.now());
    expect(() => insert.run("regular", 60, 900, Date.now())).toThrow(/UNIQUE/);
  });
});
