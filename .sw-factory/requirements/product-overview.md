# Product Overview — Webgrid+

## Business Problem
Players need a fast, low-friction way to run a reflex benchmark-style game and compare their scores, but current ad-hoc behavior depends on a single frontend stack and implicit Supabase data contracts, making the app difficult to evolve safely.

## Current State
Webgrid+ currently runs as a Vue/Vite single-page client app with Supabase-hosted data access for auth, gameplay persistence, leaderboard lookup, profile details, and profile image upload. Game flow includes two modes (Regular 60s and Blitz 15s), in-browser session timing, and score computation from click accuracy/speed.

## Product Description
Webgrid+ is a browser game experience where users:
- start a timed round in one of two modes,
- click a moving target on a 30x30 grid,
- receive an NTPM/BPS score at round end,
- save scores when authenticated,
- view game rankings and personal profile statistics,
- browse leaderboards for each mode,
- manage basic profile state including display picture.

## Personas
- Unauthenticated visitors: want immediate play and an easy path to signup/login.
- Authenticated players: want reliable score persistence and longitudinal performance metrics.
- Returning players: want direct access to leaderboard context and own history.

## Success Metrics
- Game sessions can complete successfully with score saved and ranked when logged in.
- Leaderboards render with deterministic ranking for each game mode.
- Profile pages display current and historical summary stats for both game modes.
- Authenticated users can update profile picture and sign out.
- Navigation state remains consistent across login, signup, and post-auth pages.

## Technical Requirements (Product-level)
- Preserve all public user behavior currently present before and after migration.
- Keep data model semantics stable where possible: game type, score records, profile aggregates, and ranking outputs.
- New implementation must support SSR and RSC-first rendering where practical.
- Use SQLite + Drizzle ORM for persistence in the target architecture.
- Separate frontend, domain services, and data layer into clear, testable packages/modules.
- Keep game logic deterministic and unit-testable independent of UI framework.

