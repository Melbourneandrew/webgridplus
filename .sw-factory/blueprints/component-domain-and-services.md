# Component Blueprint: Domain and Gameplay Components

## Capability Summary
This component blueprint captures core application logic not coupled to framework rendering. The emphasis is on game score computation, leaderboard ranking interpretation, and profile aggregation transformations. This separation enables unit tests independent of Next.js and UI concerns.

## Core Components

```component
name: GameSessionService
container: Next.js App
responsibilities:
  - Validate and normalize game mode configuration
  - Maintain in-memory round state transitions and click accounting
  - Compute NTPM and BPS deterministically from click/timer inputs
```

```component
name: ScoringEngine
container: Next.js App
responsibilities:
  - Implement BPS/NTPM formula with clamping and rounding policies
  - Expose pure functions with typed input/output contracts
```

```component
name: RankService
container: Next.js App
responsibilities:
  - Determine leaderboard rank from persisted score sequence and mode filters
  - Resolve ties and ordering policy consistently with existing behavior
```

```component
name: ProfileAggregationService
container: Next.js App
responsibilities:
  - Merge per-mode profile stats into a single response contract
  - Shape fields for display and export typed snapshots
```

```component
name: GameFlowCoordinator
container: Next.js App
responsibilities:
  - Orchestrate end-of-game flow (persist decision, ranking fetch, profile lookup fallback)
  - Emit result DTO consumed by game-over UI
```

## System Contracts
- `#ScoringEngine` contract: input includes `{ clicksCorrect, clicksIncorrect, modeTimeSeconds, gridCellCount }`, output `{ ntpm, bps }`.
- `#GameSessionService` contract: exposes immutable state updates (start/reset/handleClick/tick).
- `#RankService` contract: input `gameId`, `gameType`, output `{ rank }` with null-safe behavior.

### Key Contracts
- Score computation must be deterministic and side-effect free.
- Ranking calculations must not mutate input records.
- Cross-mode stats must stay mode-specific and not bleed state across modes.

## Data Model
```model
name: PlayedGame
store: SQLite
description: Persisted round outcome linked to a player and mode.
fields:
  - id: INTEGER (required)
  - user_id: TEXT (required)
  - game_type_id: INTEGER (required)
  - bps: REAL (required)
  - created_at: TIMESTAMP (required)
constraints:
  - foreign key to users.id
  - index on (game_type_id, bps desc, created_at desc)
```

```model
name: GameType
store: SQLite
description: Canonical mode catalog.
fields:
  - id: INTEGER (required)
  - type_name: TEXT (required)
constraints:
  - unique(type_name)
```

```model
name: ProfileStats
store: SQLite
description: Derived or materialized statistics for ranking and profile pages.
fields:
  - profile_id: TEXT (required)
  - game_type_id: INTEGER (required)
  - rank: INTEGER
  - highest_score: REAL
  - average_score: REAL
  - total_games_played: INTEGER
constraints:
  - composite key (profile_id, game_type_id)
  - nullable for first-time users
```

## Architecture Decision Records

### ADR-101: Keep game logic pure and side-effect free
#### Context
Current implementation computes score in view layer and logs intermediate state directly.

#### Decision
Isolate all math and ranking semantics in domain services with typed pure functions.

#### Consequences
Simpler testing and less regression risk across UI refactors.

### ADR-102: Minimize data crossing into client components
#### Context
RSC boundaries serialize payloads and can inflate page payloads.

#### Decision
Server components should pass minimal projection to client components (`name`, `bps`, `profilePictureUrl`) instead of full row objects, aligned to `server-serialization`.

#### Consequences
Lower serialization overhead and clearer data contracts.

