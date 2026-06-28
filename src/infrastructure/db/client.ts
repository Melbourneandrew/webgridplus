import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ENV } from "@/lib/env";
import * as schema from "./schema";

const sqlite = new Database(ENV.DATABASE_URL);
sqlite.pragma("journal_mode = WAL");

const currentDir = dirname(fileURLToPath(import.meta.url));
const migrationSql = readFileSync(join(currentDir, "migrations/0001_init.sql"), "utf8");
sqlite.exec(migrationSql);

export const db = drizzle(sqlite, { schema });

export type DbClient = typeof db;
