CREATE TABLE IF NOT EXISTS game_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type_name TEXT NOT NULL UNIQUE,
  duration_seconds INTEGER NOT NULL,
  grid_cell_count INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token_hash TEXT NOT NULL UNIQUE,
  access_expires_at INTEGER NOT NULL,
  refresh_token_hash TEXT NOT NULL UNIQUE,
  refresh_expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  rotated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS auth_sessions_user_idx ON auth_sessions(user_id);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  profile_picture TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS played_games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type_id INTEGER NOT NULL REFERENCES game_types(id),
  bps REAL NOT NULL,
  played_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS played_games_user_game_idx ON played_games(user_id, game_type_id);
CREATE INDEX IF NOT EXISTS played_games_game_bps_idx ON played_games(game_type_id, bps);

CREATE TABLE IF NOT EXISTS profile_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type_id INTEGER NOT NULL REFERENCES game_types(id),
  rank INTEGER,
  highest_score REAL,
  average_score REAL,
  total_games_played INTEGER,
  updated_at INTEGER NOT NULL,
  UNIQUE(profile_id, game_type_id)
);
