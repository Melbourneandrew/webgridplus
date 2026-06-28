## Overview
This feature covers signup, login, session checks, and session termination behavior used across navigation and content visibility.

## Terminology
- Session: Supabase/identity state indicating signed-in status.
- New account flow: onboarding through email + password.

## Requirements

### REQ-AUTH-001: User signup
As a new user, I want to create an account with display name, email, and password, so that my scores and profile are associated with my identity.

#### AC-AUTH-001.1
When signup is submitted with valid fields, the system shall create an account and establish an authenticated session.

#### AC-AUTH-001.2
When signup fails, the system shall surface a user-facing error message.

### REQ-AUTH-002: User login
As a returning user, I want to sign in with credentials, so I can continue playing with profile persistence.

#### AC-AUTH-002.1
When login succeeds, the system shall navigate to game entry and refresh auth-aware UI state.

#### AC-AUTH-002.2
When login fails, the system shall present an error message.

### REQ-AUTH-003: Navigation/session-aware visibility
As a visitor, I want nav links to reflect authentication state, so I know available actions.

#### AC-AUTH-003.1
When a user is unauthenticated, navigation shall show `Login` and `Signup`.

#### AC-AUTH-003.2
When a user is authenticated, navigation shall include `Profile` and suppress signup/login.

### REQ-AUTH-004: Session termination
As a signed-in user, I want to sign out, so I can end the current session.

#### AC-AUTH-004.1
When sign-out is triggered, the user shall be routed to login and treated as unauthenticated.

