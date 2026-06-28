# Webgrid+ Migration Implementation Log

## 2026-06-27

- Bootstrapped Next.js App Router with App directory and global CSS.
- Replaced Vue/Vite runtime scaffolding and routing with Next route pages for:
  - `/`
  - `/game`
  - `/leaderboard`
  - `/profile/[userId]` and `/profile` redirect guard
  - `/login`
  - `/signup`
  - `/dev` (development-only)
- Added SQLite + Drizzle schema, migration SQL, and seed script.
- Added local auth layer with custom users, sessions, and cookie-backed session middleware.
- Implemented core domain modules for scoring and game session state.
- Implemented leaderboard/profile/game service orchestration layers.
- Added basic unit tests for scoring and game session initialization.
- Added basic Playwright smoke tests and Vitest configuration.
- Added precommit hook that runs typecheck + unit tests.
- Updated runtime dependencies and removed Vue/Supabase packages.
