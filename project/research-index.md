# Neuralink Game Research Index

## Pending Research Areas
- [ ] Original Neuralink Webgrid timing, target movement, and hit-testing behavior.
- [ ] Exact scoring constants and penalty handling beyond current log2(900) BPS model.
- [ ] Any anti-cheat, latency compensation, or session integrity behavior.
- [ ] Device input nuances (mouse/touch/keyboard input handling and UX differences).

## References Collected
- Internal app references currently implemented (for parity comparison)
  - Game mode durations: Regular=60, Blitz=15
  - Grid size: 30x30
  - Scoring formula from existing component
  - Grid size currently fixed to 30x30 in app UI
- Neuralink Play Webgrid bundle analysis (retrieved 2026-06-27, https://neuralink.com/webgrid/)
  - Bundle entry examined: `https://neuralink.com/assets/entries/pages_webgrid.page.CppXssKR.js`
  - Formula observed: `BPS = max(log2(gridSize^2 - 1) * NTPM / 60, 0)`
  - NTPM observed as rolling net correct minus incorrect clicks in the last 60 seconds
  - Target reposition uses random pick with explicit exclusion of previous active target
  - Hit testing includes outside-grid pointerup treated as miss

## How to Continue Research Later
- Capture raw gameplay traces in the existing Vue app for baseline data.
- Compare against any available open-source/Webgrid mirrors or docs.
- Add test fixtures under `project/research-notes/` without changing app behavior.

## Completed Notes
- `project/research-notes/neuralink-webgrid-bundle-analysis-2026-06-27.md`
