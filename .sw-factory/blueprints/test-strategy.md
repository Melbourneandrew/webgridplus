# Blueprint: Test Strategy

## Scope
Testability is a first-class requirement for gameplay scoring, auth flow guards, leaderboard/profile aggregation, and migration integrity.

Status legend: `[x]` covered, `[~]` partially covered, `[ ]` planned.

## Unit Tests
- [x] `src/domain/scoring`: deterministic fixtures for `NTPM` and `BPS` formulas, validation, and display helpers.
- [x] `src/domain/game`: grid invariants and session start/reset/click/tick behavior.
- [ ] `src/services`: game submission, profile aggregation, and leaderboard shaping tests with mocked boundaries.
- [~] `src/infrastructure/db`: in-memory migration contract tests exist; repository query fixtures remain.
- [x] `src/infrastructure/storage`: path, filename-safety, URL, and byte-persistence tests.

## Integration Tests
- [ ] API-level tests for authenticated/unauthenticated score insertion.
- [ ] Profile ownership and route authorization checks.
- [ ] Leaderboard row retrieval for both game modes and empty states.
- [~] Media upload contract tests: local storage path and URL are covered; route auth, MIME/size validation, and failure responses remain.

## Contract and Migration Tests
- [~] Migration smoke test: schema applies idempotently in memory; no rollback migration exists.
- [ ] Seed consistency test: regular/blitz game types exist and are stable.
- [ ] Data model contract tests between `profile_stats` and leaderboard payload shape.

## SSR/Client Boundary Tests
- [~] Basic Playwright smoke coverage for home and leaderboard rendering.
- [ ] Verify profile rendering with fixture server data and game hydration behavior.
- [ ] Confirm serialization payload minimization by contract tests.

## Performance Checks
- [ ] Benchmark post-game mutation + rank/profile lookup; current lookups are sequential.
- [~] Profile uploads use async filesystem I/O; SQLite uses the synchronous `better-sqlite3` driver by design.
