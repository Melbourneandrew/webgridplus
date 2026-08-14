# Container Blueprint: Webgrid+ Next.js Runtime

## Container Summary
The new app runs as a single Next.js deployment composed of App Router routes and server-side modules. A browser-facing React surface consumes server-rendered HTML and streams dynamic sections where data availability allows. Runtime decisions prioritize stable SSR for auth-gated routes, leaderboard/profile pages, and deterministic game metadata delivery.

## Infrastructure
- Runtime: Node.js on Vercel (or equivalent platform) with Next.js App Router.
- Database: SQLite (local development and production deployment strategy as configured by hosting adapter).
- ORM: Drizzle ORM with typed schema migrations.
- Auth storage: session and user tables in SQLite (or integration provider in the near term) with secure cookie session.
- Observability: structured logs for game submissions, route latency, ranking writes, upload operations, and auth failures.

## Entry Points and Boundaries
- `src/app/page.tsx` and nested route segments for public pages.
- `src/app/game/page.tsx` as SSR/CSR hybrid game entry.
- `src/app/profile/[userId]/page.tsx` server-loaded profile data.
- `src/app/leaderboard/page.tsx` reads mode-specific ranking views on the server.
- `src/app/api/*/route.ts` for mutation endpoints where needed.
- `src/lib/db`, `src/lib/domain`, `src/lib/services` as internal service boundaries.

### Auth Boundaries
- SSR session checks happen in server components / layout guards.
- All server mutations (`/api` handlers or Server Actions) must verify auth before writes, consistent with `server-auth-actions`.

## System Contracts
- `#GameSessionService` handles deterministic scoring and round state derivations.
- `#LeaderboardService` and `#ProfileService` must be idempotent where practical.
- `#StorageService` owns profile media writes and signed URL retrieval.

## Architecture Decision Records

### ADR-001: Use Next.js App Router with mixed SSR and client interactivity
#### Context
Legacy client app couples all logic to component state; target architecture requires SSR where practical while preserving responsive gameplay.

#### Decision
Use App Router with RSC by default and narrow client boundaries (`'use client'`) for game grid, timer UI, and interactions.

#### Consequences
Faster initial render for profile/leaderboard pages; explicit client component boundaries for real-time gameplay interactions.

### ADR-002: Enforce server-side authorization on all mutations
#### Context
Auth/session checks currently rely on client usage patterns and can drift in security posture.

#### Decision
All score writes, profile mutations, and media uploads must execute behind server-authenticated APIs/Server Actions with auth checks, aligned to `server-auth-actions`.

#### Consequences
Safer data mutation surface and easier auditability.

### ADR-003: Keep scoring pure in domain layer
#### Context
Current scoring logic is embedded in UI and reused only by one component, but migration is expected to evolve tests and multi-platform consumers.

#### Decision
Move score computation to a pure domain module and export only structured outputs.

### ADR-004: Use Drizzle on SQLite now, with adapter path for larger deployments
#### Context
Requirement mandates SQLite + Drizzle; future scale needs migration-ready boundaries.

#### Decision
Adopt Drizzle with sqlite dialect as the initial persistence layer and keep data-access contracts abstraction-oriented for alternate adapters.

