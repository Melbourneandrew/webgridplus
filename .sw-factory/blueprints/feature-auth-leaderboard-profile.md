# Feature Blueprint: Auth, Leaderboard, Profile, and Asset Update

## Feature Summary
This feature composes authentication, profile pages, and ranking surfaces into a secure, SSR-friendly experience that preserves existing user journeys.

## Feature Blueprint Composition
This feature composes `@feature/authentication`, `@feature/leaderboard-and-profile`, and components:
- `#DrizzleDb`
- `#PlayerProfileQueries`
- `#RankingQueries`
- `#StorageService`
- `#AuthService`

Routes:
- `src/app/(auth)/signup`, `src/app/(auth)/login`
- `src/app/leaderboard/page.tsx`
- `src/app/profile/[userId]/page.tsx`

## Feature-Specific Components

```component
name: AuthService
container: Next.js App
responsibilities:
  - Sign up and sign in flows
  - Session validation and retrieval
  - Sign out command with cookie/session cleanup
```

```component
name: LoginPage
container: Next.js App
responsibilities:
  - Form-level validation and error handling
  - Redirect strategy for authenticated session handoff
```

```component
name: SignupPage
container: Next.js App
responsibilities:
  - Account creation with display name
  - Initial auth session bootstrap and navigation handoff
```

```component
name: LeaderboardPage
container: Next.js App
responsibilities:
  - Fetch leaderboards server-side
  - Render ranked rows and deep-link profile actions
```

```component
name: ProfilePage
container: Next.js App
responsibilities:
  - Resolve user identity from route or current session
  - Render per-mode profile aggregates
  - Expose profile picture upload action for authenticated owner
```

## System Contracts
- `@feature/authentication` acceptance behaviors preserve route outcomes and navbar visibility transitions.
- Profile pages should remain resilient when one of regular/blitz aggregates is missing.
- Leaderboard fetch for a mode shall always return list data; empty lists render as explicit empty-state UI.

### Key Contracts
- Any mutation endpoint must run auth verification before writing.
- Error states should remain informative but not leak internal storage details.

## Architecture Decision Records

### ADR-401: Auth checks in server actions/routes only
#### Context
Client-only auth checks can be bypassed for direct endpoint invocations.

#### Decision
Authenticate in server mutation entrypoints (`/api/*` and server action functions).

#### Consequences
Safer and consistent handling for privileged actions.

### ADR-402: Profile edits are owner-scoped
#### Context
Profile image currently editable via UI state with no strict authorization checks.

#### Decision
Only the requesting authenticated principal may edit their own profile image.

#### Consequences
Clear authorization boundary and lower risk of cross-user mutation.

