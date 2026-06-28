# Webgrid+ Architecture State (Pre-Port Baseline)

## Current App Facts
- Stack: Vue 3 + Vite + PrimeVue + Tailwind, backed by Supabase auth/storage/db.
- Game modes: Regular (60s) and Blitz (15s).
- Gameplay flow: random active cell on a 30x30 grid, click handling, timer tick, score update.
- Score formula: 
  - NTPM = (correct - incorrect) * (60 / mode time)
  - BPS = max(0, (NTPM * log2(900)) / 60)
- Post-game: save played game, fetch rank, optionally fetch profile averages.
- Navigation includes game, leaderboard, profile, login, signup.
- Auth session controls nav and access visibility only.

## Current Behavioral Risks to Preserve
- If user is not signed in, score can still be shown but persistence does not complete.
- LocalStorage key `hasVisitedWebgrid` suppresses welcome modal.
- Profile page accepts `/profile/:userId?` and falls back to signed-in user when missing.
- Leaderboard view mode switch toggles between Regular/Blitz data.

## Durability Constraints
- Must keep game/leaderboard/profile semantics stable through migration.
- Must preserve display semantics for user feedback messaging and edge-state handling.
