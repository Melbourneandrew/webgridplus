## Overview
This feature covers core gameplay for Webgrid+ in Regular and Blitz modes, including session timing, target progression, scoring, and end-of-game persistence eligibility. Players need a consistent scoring model to make rounds comparable over time.

## Terminology
- Regular: 60-second gameplay mode.
- Blitz: 15-second gameplay mode.
- NTPM: Net targets per minute, computed from correct and incorrect clicks and mode duration.
- BPS: Bits per second score shown as the player result.

## Requirements

### REQ-GAME-001: Start game and mode selection
As a player, I want to select Regular or Blitz and start a new game, so that I can play the intended pace.

#### AC-GAME-001.1
When the player selects a mode, the active timer shall set to the mode duration (`60` for Regular, `15` for Blitz) and the grid target position shall initialize deterministically for that session.

#### AC-GAME-001.2
When the player clicks a non-target cell, the system shall increment incorrect clicks and provide immediate local feedback distinct from correct clicks.

### REQ-GAME-002: Score calculation
As a player, I want my score to be computed consistently during play, so that performance is comparable across rounds.

#### AC-GAME-002.1
When a valid mode is active, NTPM shall be calculated as `(correct - incorrect) * (60 / mode time)`.

#### AC-GAME-002.2
When the timer reaches zero, BPS shall compute from NTPM using a function equivalent to `(max(0, NTPM) * log2(900)) / 60`.

#### AC-GAME-002.3
When a round ends, the UI shall present score, NTMP/NTPM, and post-round actions.

### REQ-GAME-003: Session state transitions
As a player, I want reliable reset and replay, so that I can run multiple rounds quickly.

#### AC-GAME-003.1
When play starts, timer interval cleanup shall ensure no duplicate running intervals.

#### AC-GAME-003.2
When the player closes the game-over UI or starts over, the current game state shall reset scores, timing, active target, and modal visibility.

### REQ-GAME-004: Unauthenticated round handling
As a player, I want score display even without signing in, so that gameplay is usable before account creation.

#### AC-GAME-004.1
When no active session exists at game end, the system may still show computed score; it shall only require persistence when a signed-in user saves score.

