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

## How to Continue Research Later
- Capture raw gameplay traces in the existing Vue app for baseline data.
- Compare against any available open-source/Webgrid mirrors or docs.
- Add test fixtures under `project/research-notes/` without changing app behavior.
