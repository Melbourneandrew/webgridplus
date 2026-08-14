import {
  integer,
  real,
  sqliteTable,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const gameTypes = sqliteTable("game_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  typeName: text("type_name").notNull().unique(),
  durationSeconds: integer("duration_seconds").notNull(),
  gridCellCount: integer("grid_cell_count").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("auth_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessTokenHash: text("access_token_hash").notNull().unique(),
  accessExpiresAt: integer("access_expires_at", { mode: "timestamp" }).notNull(),
  refreshTokenHash: text("refresh_token_hash").notNull().unique(),
  refreshExpiresAt: integer("refresh_expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  rotatedAt: integer("rotated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  profilePicture: text("profile_picture"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const playedGames = sqliteTable(
  "played_games",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    gameTypeId: integer("game_type_id").notNull().references(() => gameTypes.id),
    bps: real("bps").notNull(),
    playedAt: integer("played_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [
    index("played_games_user_game_idx").on(table.userId, table.gameTypeId),
    index("played_games_game_bps_idx").on(table.gameTypeId, table.bps),
  ]
);

export const profileStats = sqliteTable(
  "profile_stats",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    profileId: text("profile_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    gameTypeId: integer("game_type_id").notNull().references(() => gameTypes.id),
    rank: integer("rank"),
    highestScore: real("highest_score"),
    averageScore: real("average_score"),
    totalGamesPlayed: integer("total_games_played"),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("profile_stats_unique").on(table.profileId, table.gameTypeId)]
);
