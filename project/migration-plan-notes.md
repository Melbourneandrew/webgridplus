# Migration Notes (Working)

## Completed This Pass
- Replaced Vue/Supabase app shell with Next.js App Router.
- Added server-side route-driven pages for required app routes and development route.
- Added `src/domain` game/scoring modules with deterministic formulas and tests.
- Added `src/infrastructure/db` Drizzle schema, migration SQL, and seed script.
- Added local auth session model (users, sessions, profiles, profile picture upload).
- Added services: auth/session, game, leaderboard, profile.
- Added initial client game component with timer/grid and unauthenticated-score fallback.
- Added Playwright and Vitest verification scaffolding.
- Added `.env.example`, hooks config, and docs updates.

## Open Work / Remaining
- Remove remaining rough edges before final verification:
  - `src/services/game/game-service.ts` currently kept as server-only orchestrator; validate API parity.
  - Playwright smoke assertions can be hardened for route interactions.
  - Profile picture upload endpoint needs validation size/type limits and client UI to upload.
  - Add tests for leaderboard/profile query edge states.
- Tune ranking and tie-break behavior against legacy data semantics.
- Add `/auth/logout` redirect route currently present, and `GET`/`POST` behavior should be standardized.

