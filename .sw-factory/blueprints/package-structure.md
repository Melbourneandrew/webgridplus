# Blueprint: Package and Source Structure

## Objective
Create a mature monorepo-like internal structure with clear boundaries and no all-in-one-file patterns.

## Planned Package Layout

```text
src/
  app/
    (public)/
    (auth)/
    game/
    leaderboard/
    profile/
    api/
  components/
    ui/
    game/
    profile/
  features/
    game/
    leaderboard/
    profile/
    auth/
  domain/
    game/
    leaderboard/
    profile/
    scoring/
  services/
    game/
    profile/
    leaderboard/
    storage/
    auth/
  infrastructure/
    db/
      drizzle/
      migrations/
      repositories/
    storage/
  hooks/
  lib/
    env.ts
    validation.ts
```

## Structure Principles
- `domain/` contains pure logic (no framework imports).
- `services/` contains orchestration and application-level use cases.
- `infrastructure/db` owns all persistence details.
- `app/` remains thin and composition-focused.
- `components/ui` are shared presentational primitives.
- Feature-owned components and hooks stay inside `features/<name>/`.
- Tests mirror structure in `__tests__/` near each package.

## ADR

### ADR-501: Feature-first code ownership
#### Context
Current app has all logic in view files with little module grouping.

#### Decision
Adopt feature-first, layered structure with explicit domain/service/infrastructure boundaries.

#### Consequences
Faster navigation for developers and clearer ownership boundaries for migration and testing.

