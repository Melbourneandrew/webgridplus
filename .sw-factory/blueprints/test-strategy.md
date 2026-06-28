# Blueprint: Test Strategy

## Scope
Testability is a first-class requirement for gameplay scoring, auth flow guards, leaderboard/profile aggregation, and migration integrity.

## Unit Tests
- `src/domain/scoring`: deterministic fixtures for `NTPM` and `BPS` formulas.
- `src/domain/game`: state transition tests for session start/reset/click/tick behavior.
- `src/services`: `GameFlowCoordinator`, `ProfileAggregationService`, `RankService` pure service tests.
- `src/infrastructure/db`: query adapter tests with fixture DB (SQLite in-memory for integration-style unit tests).

## Integration Tests
- API-level tests for authenticated/unauthenticated score insertion.
- Profile ownership and route authorization checks.
- Leaderboard row retrieval for both game modes and empty states.
- Media upload contract tests (file validation, URL return contract, failure cases).

## Contract and Migration Tests
- Migration smoke test: schema can apply and rollback.
- Seed consistency test: regular/blitz game types exist and are stable.
- Data model contract tests between `profile_stats` and leaderboard payload shape.

## SSR/Client Boundary Tests
- Verify `leaderboard` and `profile` pages render with server data.
- Verify game session components run as client boundaries and hydrate cleanly.
- Confirm serialization payload minimization by contract tests (client components receive only required fields).

## Performance Checks
- Benchmark post-game mutation + rank/profile lookup with concurrent queries (Promise.all).
- Ensure no synchronous blocking I/O in server actions.

