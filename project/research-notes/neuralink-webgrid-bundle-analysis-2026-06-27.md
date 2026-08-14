# Neuralink Webgrid Reverse-Engineering Notes

## Retrieval snapshot
- Date retrieved: 2026-06-27
- Primary source: https://neuralink.com/webgrid/
- Verified bundled entry source: https://neuralink.com/assets/entries/pages_webgrid.page.CppXssKR.js

## Verified findings from public bundle
- The gameplay component renders a square canvas and tracks trials as `[timestamp, isCorrect]`.
- Click handling logic in the bundle applies:
  - Outside-grid pointerup: recorded as incorrect.
  - Inside active target: recorded as correct and immediately moves to a new random target.
  - Elsewhere: recorded as incorrect and no target change.
- Target randomization is constrained not to repeat the same cell as the previous target.
- Score display uses `E(l,t)` where:
  - `l = net correct targets within 60 seconds`
  - `t = grid size`
  - formula observed: `Math.max(Math.log2(t*t-1) * l / 60, 0)`
- Timer behavior in the observed script:
  - UI timer constant set from `y = 70` seconds.
  - Score uses a rolling 60-second performance window (`Date.now() - v[0] < 6e4`), indicating the 60s scoring horizon is independent of timer label.
- Intro text states score in BPS and mentions NTPM and grid size.
- Desktop grid appears default `t = 30`; mobile mode switches to smaller grid (observed via media-query branch).
- A visible high-score metric tracks peak `l` (rolling net hits) during play and posts to game-over.

## Open inferences and uncertainties
- We could not confirm whether Neuralink applies additional anti-cheat, latency filtering, pointer device adaptation, or persistence safeguards from this frontend bundle alone.
- We could not confirm server-side validation/ratelimiting from this bundle; it likely exists elsewhere or is absent.
- The exact behavior after game end (e.g., sharing intent/score submission backend) was not fully inferable from static JS alone.

## Evidence confidence
- High for formula and target movement behavior (direct constant/function inspection).
- Medium for game-mode controls and timing policy due minified naming and compact UI state machine.
