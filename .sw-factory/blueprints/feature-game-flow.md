# Feature Blueprint: Game Flow, Score, and Result Persistence

## Feature Summary
This feature maps to gameplay and scoring requirements. The implementation uses SSR for initial shell and a client boundary for real-time interaction, with domain services and persistence services injected through typed contracts.

## Feature Blueprint Composition
This feature composes `@feature/gameplay-and-score` and these components:
- `#ScoringEngine`
- `#GameSessionService`
- `#GameCommands`
- `#RankService`

Server page routes should hydrate initial mode metadata, while the game client component runs timers and click handling.

## Feature-Specific Components

```component
name: GamePage
container: Next.js App
responsibilities:
  - Render game shell and selected mode metadata from server props
  - Mount client `GameClient` for runtime interaction
```

```component
name: GameClient
container: Next.js App
responsibilities:
  - Capture click events and timer ticks
  - Call `#ScoringEngine` on each tick or interaction boundary
  - Submit `played game` result to server action/route on round completion
```

```component
name: GameOverPanel
container: Next.js App
responsibilities:
  - Display final BPS/NTPM and ranking summary
  - Offer play-again and social actions
```

## System Contracts
- `#GameClient` owns transient state only; all persisted outcomes are submitted through controlled server calls.
- Ranking and average reads happen after successful play persistence, or as graceful fallback placeholders when persistence is unavailable.
- Welcome modal visibility is stored via browser storage with one-time gating.

### Data Flow
- Client starts round in `GameClient`, computes score via `#ScoringEngine`.
- On completion, `GameClient` sends minimal DTO to `GameCommands.recordPlayedGame`.
- Result is used to fetch optional rank and user aggregates via `#RankService` + `#ProfileAggregationService`.

## Architecture Decision Records

### ADR-301: Split game rendering from game persistence
#### Context
The existing app does scoring and persistence in the same component file.

#### Decision
Split into game orchestration (`GameClient`) and orchestration services on the server.

#### Consequences
Lower coupling and higher testability for gameplay behavior.

### ADR-302: Use parallel fetch orchestration after game completion
#### Context
Post-game UI currently performs sequential awaits.

#### Decision
Use concurrent queries (`Promise.all`) for independent lookups (`rank` and optional profile aggregates) to reduce tail latency.

#### Consequences
Faster game-over response and improved perceived performance.

