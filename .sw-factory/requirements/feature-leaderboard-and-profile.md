## Overview
This feature enables cross-user competition and personal performance history by surfacing leaderboards and per-user profile statistics for both modes.

## Terminology
- Leaderboard row: one completed score entry rendered for a selected game type.
- Profile summary: aggregate stats for one game type (`rank`, `highest_score`, `average_score`, `total_games_played`).
- User profile route: route with optional `userId` path segment.

## Requirements

### REQ-LB-001: Leaderboard browsing
As a player, I want to browse leaderboards per game type, so I can compare my results.

#### AC-LB-001.1
When game type changes to Regular/Blitz, the list shall update to that mode’s ranking set.

#### AC-LB-001.2
When a row is selected, the system shall navigate to that player’s profile view.

### REQ-LB-002: Profile viewing
As a player, I want to view profile stats for a given user, so I can inspect historical performance.

#### AC-LB-002.1
When route has no `userId`, the system shall show the signed-in user’s profile.

#### AC-LB-002.2
When no display name exists for the selected user, the profile view shall still handle gracefully and indicate missing profile state.

### REQ-LB-003: Profile stats calculation surface
As a signed-in player, I want to view mode-separated stats, so I can track progress.

#### AC-LB-003.1
When profile has Regular data, the UI shall expose rank/highest/average/played count for Regular.

#### AC-LB-003.2
When profile has Blitz data, the UI shall expose rank/highest/average/played count for Blitz.

### REQ-LB-004: Profile picture
As a signed-in player, I want to upload a profile picture, so my profile is visually identifiable.

#### AC-LB-004.1
When a valid image is uploaded, the system shall store it and update the user profile image reference.

#### AC-LB-004.2
When signed out, profile image editing controls shall be unavailable.

