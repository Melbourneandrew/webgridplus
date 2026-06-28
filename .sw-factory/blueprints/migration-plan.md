# Migration Blueprint: Vue/Supabase App → Next.js + SQLite/Drizzle

## Objective
Preserve behavior and external APIs while moving runtime to a modular Next.js architecture.

## Phases

### Phase 1 — Schema and Contracts
1. Create Drizzle schema mirror for:
   - users/profiles
   - game_types
   - played_games
   - game_rankings
   - profile_stats
   - regular_leaderboard / blitz_leaderboard projections
2. Add migration baseline and seed data for `game_types` (`regular`, `blitz`) and `grid_size` expectations.

### Phase 2 — Domain Extraction
1. Move scoring formula and game-state transitions out of UI into domain modules.
2. Add contract tests for score math and mode behavior.

### Phase 3 — Data Access Layer
1. Implement repositories/services with explicit read/write boundaries.
2. Add ranking/profile adapters with mode-scoped behavior.
3. Add safe fallbacks for missing profile rows.

### Phase 4 — Auth and Profile Surfaces
1. Implement auth service for signup/login/signout/session retrieval.
2. Port navbar and profile access gating.
3. Add route-level ownership checks.

### Phase 5 — UI Composition in Next.js App Router
1. Server-render profile/leaderboard pages.
2. Keep game interaction in `'use client'` boundaries.
3. Add suspense boundaries for secondary sections.

### Phase 6 — Data Validation and Parity Testing
1. Run behavior parity scripts comparing selected legacy paths (scores, leaderboard row shape, profile fallback behavior).
2. Run test plan from `test-strategy.md`.

## SSR/Data-Flow Blueprint
- Page-level route handlers resolve auth and data before render.
- Client game component receives only initial mode and minimal UI config.
- Post-result server action returns rank + profile aggregates in one orchestrated flow.
- Route caching: disable for mutation-heavy pages where needed.

## Open Risks / Assumptions
- Legacy leaderboard and profile source queries may rely on pre-existing SQL logic not yet reverse engineered.
- Current `.env` contains public secrets; target platform should move to runtime secret management.

