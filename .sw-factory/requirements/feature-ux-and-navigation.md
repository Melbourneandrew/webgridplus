## Overview
This feature captures non-game interaction surfaces: first-visit guidance, route-level entry behavior, and developer-facing inspection workflows.

## Terminology
- Dev view: local development helper route used to exercise auth/leaderboard/game mutations.
- Welcome prompt: first-visit modal shown once per browser context.

## Requirements

### REQ-UX-001: First-visit onboarding
As a first-time visitor, I want a short introduction modal, so I understand the target and controls quickly.

#### AC-UX-001.1
When no `hasVisitedWebgrid` marker exists, the welcome modal shall be visible on game start.

#### AC-UX-001.2
When the modal is closed, a persistence flag shall be written so it does not auto-show again on subsequent visits.

### REQ-UX-002: Route structure
As a player, I want route-based access to major app sections, so I can continue where I left off.

#### AC-UX-002.1
Route availability shall include `/`, `/game`, `/leaderboard`, `/profile/:userId?`, `/login`, `/signup`.

#### AC-UX-002.2
The nav bar shall expose Play, Leaderboard, and auth/profile actions with route navigation.

### REQ-UX-003: Dev workflow
As an engineer, I want a dedicated non-production route for manual testing, so I can validate repository data functions quickly.

#### AC-UX-003.1
The Dev view shall keep helper operations for signup/signin/profile-fetching/leaderboard/add game calls.

