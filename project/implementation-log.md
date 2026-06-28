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
- Reverse-engineered Neuralink public Webgrid bundle for scoring and interaction behavior (retrieved 2026-06-27).
- Expanded domain core with framework-free modules:
  - `src/domain/game/modes.ts` (mode config and grid size constants)
  - `src/domain/game/grid.ts` (cell indexing, validation, and target selection helpers)
  - `src/domain/game/session.ts` (pure state transitions: start/ tick/ click/register/reset)
  - `src/domain/scoring/{index,constants}.ts` (validated compute functions and constants)
- Replaced legacy `src/domain/game/mode.ts` with a compatibility re-export to the new `modes` module.
- Added deterministic unit tests for scoring edge cases, rolling formulas, grid invariants, and session transitions.
- Added basic Playwright smoke tests and Vitest configuration.
- Added precommit hook that runs typecheck + unit tests.
- Updated runtime dependencies and removed Vue/Supabase packages.
