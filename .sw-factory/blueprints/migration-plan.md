# Migration Blueprint: Vue/Supabase App → Next.js + SQLite/Drizzle

## Objective
Preserve behavior and external APIs while moving runtime to a modular Next.js architecture.

## Phases

Status legend: `[x]` implemented, `[~]` partial, `[ ]` not implemented. Detailed evidence and drift are tracked in `implementation-status.md`.

### Phase 1 — Schema and Contracts
1. [~] Create Drizzle schema mirror for:
   - users/profiles
   - game_types
   - played_games
   - game_rankings
   - profile_stats
   - regular_leaderboard / blitz_leaderboard projections
2. [x] Add migration baseline and seed data for `game_types` (`regular`, `blitz`) and `grid_size` expectations.

### Phase 2 — Domain Extraction
1. [x] Move scoring formula and game-state transitions out of UI into domain modules.
2. [x] Add contract tests for score math and mode behavior.

### Phase 3 — Data Access Layer
1. [x] Implement repositories/services with explicit read/write boundaries.
2. [x] Add ranking/profile adapters with mode-scoped behavior.
3. [x] Add safe fallbacks for missing profile rows.

### Phase 4 — Auth and Profile Surfaces
1. [x] Implement auth service for signup/login/signout/session retrieval.
2. [~] Port navbar and profile access gating.
3. [~] Add route-level ownership checks. The upload endpoint edits only the authenticated user's record; the upload UI is absent.

### Phase 5 — UI Composition in Next.js App Router
1. [x] Server-render profile/leaderboard pages.
2. [x] Keep game interaction in `'use client'` boundaries.
3. [ ] Add suspense boundaries for secondary sections.

### Phase 6 — Data Validation and Parity Testing
1. [~] Run behavior parity scripts comparing selected legacy paths (scores, leaderboard row shape, profile fallback behavior). Scoring fixtures exist; cross-runtime comparison does not.
2. [~] Run test plan from `test-strategy.md`. Domain, storage, migration, typecheck, build, and smoke coverage exist; API/repository suites remain.

## SSR/Data-Flow Blueprint
- Page-level route handlers resolve auth and data before render.
- Client game component receives only initial mode and minimal UI config.
- Post-result server action returns rank + profile aggregates in one orchestrated flow.
- Route caching: disable for mutation-heavy pages where needed.

## Open Risks / Assumptions
- Legacy leaderboard and profile source queries may rely on pre-existing SQL logic not yet reverse engineered.
- Current `.env` contains public secrets; target platform should move to runtime secret management.
