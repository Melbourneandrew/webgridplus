# Migration Notes (Planning)

## Phase Priority
1. Preserve route and UX parity in Next.js while adding no-op wrappers where data is mocked.
2. Port domain logic (`#ScoringEngine`, game timer/state transitions) with deterministic tests.
3. Implement data layer with Drizzle/SQLite and compatibility views.
4. Replace auth calls with server-verified session-based flows.
5. Rebuild profile/leaderboard pages using server components.

## Open Questions
- Exact schema parity and any hidden SQL views from legacy Supabase.
- Whether rank calculation uses live rank lookup views or precomputed denormalized rows.
- Browser storage and analytics requirements for welcome modal and social actions.

## Research TODO
- Capture precise scoring edge cases from production gameplay usage.
- Validate tie-breaker behavior for identical BPS values.
- Document exact upload constraints and storage URL lifecycle.
