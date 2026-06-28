# Component Blueprint: Data Access and Persistence

## Capability Summary
This blueprint defines stable data access boundaries for SQLite/Drizzle and optional storage operations. It isolates database schemas, migrations, query composition, and storage concerns behind service interfaces to keep domain code and UI independent.

## Core Components

```component
name: DrizzleDb
container: Next.js App
responsibilities:
  - Configure SQLite connection pool/runtime client
  - Expose typed table schemas for game, profile, and leaderboard entities
```

```component
name: RankingQueries
container: Next.js App
responsibilities:
  - Read leaderboard datasets for Regular/Blitz
  - Resolve display-ready profile and score payloads with ordered rows
```

```component
name: PlayerProfileQueries
container: Next.js App
responsibilities:
  - Retrieve user profile metadata
  - Retrieve per-mode aggregate statistics
  - Merge and normalize profile payload for UI consumption
```

```component
name: GameCommands
container: Next.js App
responsibilities:
  - Insert played games
  - Resolve `game_type_id` from mode enum
  - Trigger aggregate/ranking updates (materialized view or transaction strategy)
```

```component
name: StorageService
container: Next.js App
responsibilities:
  - Validate media uploads
  - Persist profile assets to configured storage (S3/local abstraction)
  - Return immutable public URLs and cleanup lifecycle metadata
```

## System Contracts
- `#RankingQueries.getLeaderboard(mode)` returns ordered `ProfileLeaderboardRow[]`.
- `#PlayerProfileQueries.getProfileSnapshot(userId)` returns `{ regular: ProfileStats | null, blitz: ProfileStats | null, profile: ProfileRecord | null }`.
- `#GameCommands.recordPlayedGame(input)` returns `{ playedGameId, gameTypeId }` for rank lookups.
- `#StorageService.uploadProfilePicture(userId,file)` returns `{ url }`.

### Integration Boundaries
- `#GameCommands` depends on transaction semantics; write failures must return structured error codes.
- `#RankingQueries` may read from materialized tables or computed views; behavior must remain ranking-equivalent.
- Storage implementations should be swappable and injectable in tests.

## Architecture Decision Records

### ADR-201: Separate commands from queries
#### Context
Current app uses direct Supabase table calls from UI, interleaving reads/writes.

#### Decision
Adopt CQRS-style split:
- command modules for inserts/uploads
- query modules for read models

#### Consequences
Clearer boundaries, better read optimization, and easier migration/testing.

### ADR-202: Keep schema and migration definitions in one package
#### Context
Long-term maintainability requires visible schema contracts and migration history.

#### Decision
Store `drizzle/schema.ts` and migrations in `src/infrastructure/db`.

#### Consequences
Easier onboarding and safe drift control.

