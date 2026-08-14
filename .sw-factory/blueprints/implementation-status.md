# Blueprint Implementation Status

Updated: 2026-08-07

This record distinguishes the target architecture in the blueprints from the code currently implemented on `main`.

## Alignment Summary

| Area | Status | Evidence / gap |
| --- | --- | --- |
| Next.js App Router runtime | Implemented | Routes live under `src/app`; Vue/Vite runtime was removed. |
| Pure game and scoring domain | Implemented and unit tested | `src/domain/game`, `src/domain/scoring`. |
| SQLite + Drizzle schema | Implemented | Schema, baseline migration, repositories, and seed script exist. |
| Local auth and secure-cookie sessions | Implemented | Signup, login, logout, session lookup, and mutation auth checks exist. |
| Game persistence | Implemented | Authenticated rounds are written through `/api/games`. |
| Leaderboard/profile SSR | Implemented at a basic level | Server pages and mode-scoped queries exist. |
| Profile-picture persistence | Partially implemented | Authenticated upload API and local filesystem storage exist; profile upload UI, MIME/size validation, replacement cleanup, and object-storage adapter do not. |
| Welcome/onboarding behavior | Implemented | Client-side one-time `localStorage` gate exists. |
| Repository/API integration coverage | Partial | Migration and local-storage tests exist; auth, game API, ranking, and profile repository fixtures remain. |
| Full legacy parity suite | Not implemented | Scoring research and domain fixtures exist, but automated Vue/Supabase-vs-Next output comparison does not. |
| Suspense/streaming boundaries | Not implemented | Profile and leaderboard pages render server-side without secondary suspense boundaries. |
| Storage abstraction/S3 path | Not implemented | Current implementation writes under `public/profile-pictures`. |
| Observability and performance benchmarks | Not implemented | Structured logs and post-game latency benchmarks remain future work. |

## Known Blueprint Drift

- Actual routes use `src/app/login` and `src/app/signup`, not route-group paths under `src/app/(auth)`.
- Persistence lives in `src/infrastructure/db`, not `src/lib/db` or a nested `drizzle/` directory.
- `GameFlowCoordinator`, `RankService`, and `StorageService` are conceptual boundaries represented today by functions/modules, not concrete classes with those names.
- Post-game rank and profile-stat reads are currently sequential; the `Promise.all` optimization in ADR-302 is not yet implemented.
- The baseline migration is forward-only; rollback automation described by the test strategy does not yet exist.

## Verification Snapshot

- TypeScript typecheck: passing.
- Unit/infrastructure tests: domain, storage-path, and migration coverage passing.
- Production build and Playwright smoke status should be confirmed with `npm run verify` on Node 22, the pinned project runtime.
