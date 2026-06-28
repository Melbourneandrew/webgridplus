# Scoring Engine Specification

## Scope
This engine computes game score as bits per second (BPS) from net target rate (NTPM) and grid geometry.

## Formula
- `ntpm = (correctClicks - incorrectClicks) * (60 / modeSeconds)`
- `bps = max(0, ntpm * log2(gridSize² - 1) / 60)`

## Rationale
- The `-1` inside the log term matches the publicly inspected Neuralink Webgrid bundle for `pages_webgrid.page.*.js` (retrieved 2026-06-27), where scoring is implemented as:
  - `Math.max(Math.log2(t*t-1) * l / 60, 0)`
- The constant effectively represents a Shannon-style capacity term and scales for target space size.
- The final `max(0, ...)` clamp matches visible behavior: negative NTPM does not produce negative BPS.

## Inputs and validation
- `calculateNtpm` requires positive mode duration and non-negative integer click counts.
- `calculateBps` requires finite grid size and finite NTPM.
- `computeScore` accepts `{ correctClicks, incorrectClicks, modeSeconds, gridSize? }` and returns `{ ntpm, bps }`.

## Open uncertainties
- Whether mode windows should always be fixed duration (60s / 15s) or converted to rolling windows like Neuralink’s observed implementation is an open compatibility question.
- The repository preserves existing Webgrid+ Regular/Blitz duration semantics while adopting the verified Neuralink log term.
