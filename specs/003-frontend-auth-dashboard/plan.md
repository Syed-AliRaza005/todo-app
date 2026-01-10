# Implementation Plan: Frontend Authentication and Dashboard

**Branch**: `003-frontend-auth-dashboard` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-frontend-auth-dashboard/spec.md`

## Summary

Implement a modern, responsive Next.js frontend application with Better Auth authentication and a task management dashboard. The application connects to an existing FastAPI backend with JWT-based authentication, providing secure multi-user task management with data isolation. Features include user signup/signin, task CRUD operations, task filtering, and statistics display.

## Technical Context

**Language/Version**: TypeScript (Next.js 16+, React 18+)
**Primary Dependencies**: Next.js 16+, Better Auth, Tailwind CSS, React, React Query (or SWR)
**Storage**: Neon Serverless PostgreSQL (backend-managed)
**Testing**: Jest/React Testing Library, Playwright (E2E)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) - Responsive (mobile: <768px, desktop: >768px)
**Project Type**: web (frontend-only implementation consuming existing backend API)
**Performance Goals**:
  - Page loads under 1 second for 100 tasks
  - API responses under 2 seconds
  - First Contentful Paint < 1.5s
  - Time to Interactive < 3s
**Constraints**:
  - Must use Better Auth for JWT token management
  - Must include JWT token in API request headers
  - Must handle authentication errors (401, 403) with redirect to signin
  - Must be mobile-first responsive design
  - Touch targets minimum 44x44px for mobile
**Scale/Scope**: Up to 10,000 users, 100 tasks per user, support for concurrent multi-user access

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase-2 Principles Verification

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| **VII. Authentication & Security** | Next.js uses Better Auth for JWT token management | ✅ PASS | Better Auth will issue and store JWT tokens |
| **VII. Authentication & Security** | Every request to backend API includes valid JWT | ✅ PASS | API client will include `Authorization: Bearer <token>` header |
| **VII. Authentication & Security** | Invalid/expired tokens redirect to signin | ✅ PASS | Error handling will detect 401/403 and redirect |
| **VIII. Data Isolation** | Frontend only accesses authenticated user's data | ✅ PASS | Backend enforces isolation; frontend only requests `/api/{user_id}/tasks` |
| **VIII. Data Isolation** | API endpoints follow pattern `/api/{user_id}/tasks` | ✅ PASS | Will use backend endpoint pattern as specified |
| **IX. Modern Architecture** | Next.js 16+ with App Router | ✅ PASS | Using latest Next.js with App Router |
| **IX. Modern Architecture** | Better Auth for authentication | ✅ PASS | Using Better Auth as specified |
| **IX. Modern Architecture** | Tailwind CSS for styling | ✅ PASS | Using Tailwind CSS for styling |
| **IX. Modern Architecture** | RESTful API endpoints | ✅ PASS | Will consume existing RESTful backend API |
| **X. User Experience** | Tailwind CSS mobile-first responsive design | ✅ PASS | Mobile-first Tailwind design |
| **X. User Experience** | Dashboard shows tasks with status indicators | ✅ PASS | Yellow/amber for Pending, green for Completed |
| **X. User Experience** | Tasks display timestamps | ✅ PASS | Show created_at and completed_at timestamps |
| **X. User Experience** | Login/Signup pages using Better Auth | ✅ PASS | Better Auth provides auth UI |
| **X. User Experience** | Real-time task state updates | ✅ PASS | Optimistic UI updates with API confirmation |
| **X. User Experience** | Empty states with friendly messages | ✅ PASS | Empty state UI components |

### Gate Result: ✅ PASS - All Phase-2 constitution principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/003-frontend-auth-dashboard/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── api-client.md    # API client contract
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
Frontend/                    # Main frontend directory (new per user request)
├── app/
│   ├── (auth)/
│   │   ├── signin/
│   │   │   └── page.tsx           # Signin page
│   │   └── signup/
│   │       └── page.tsx           # Signup page
│   ├── dashboard/
│   │   └── page.tsx               # Protected dashboard page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx          # Route protection component
│   ├── task/
│   │   ├── TaskList.tsx           # Task list component
│   │   ├── TaskItem.tsx           # Individual task display
│   │   ├── TaskForm.tsx           # Task creation/editing form
│   │   └── TaskFilters.tsx        # Task status filter controls
│   ├── ui/
│   │   ├── Button.tsx             # Reusable button component
│   │   ├── Card.tsx               # Card container component
│   │   ├── Input.tsx              # Form input component
│   │   ├── Modal.tsx              # Modal/dialog component
│   │   ├── Spinner.tsx            # Loading spinner
│   │   └── Toast.tsx              # Toast notifications
│   └── layout/
│       ├── Header.tsx             # App header with user info
│       ├── EmptyState.tsx         # Empty state display
│       └── StatsBar.tsx           # Task statistics display
├── lib/
│   ├── auth.ts                    # Better Auth configuration
│   ├── api.ts                     # API client with auth headers
│   ├── utils.ts                   # Utility functions (date formatting, etc.)
│   └── constants.ts               # App constants (API URLs, etc.)
├── hooks/
│   ├── useAuth.ts                 # Authentication state hook
│   ├── useTasks.ts                # Task data fetching hook
│   └── useLocalStorage.ts         # Local storage management
├── types/
│   ├── task.ts                    # Task TypeScript types
│   ├── user.ts                    # User TypeScript types
│   └── api.ts                     # API request/response types
└── package.json                   # Dependencies

Back-End/                             # Existing - referenced for API contract
├── src/
│   ├── models/
│   ├── api/
│   └── main.py
└── pyproject.toml
```

**Structure Decision**: Using Option 2 (Web application) - Frontend is a Next.js application consuming the existing FastAPI backend. The backend structure is already in place in the `Back-End/` directory and will be used as-is for the API contract. Frontend structure follows Next.js 16+ App Router conventions with separate directories for auth routes, protected routes, reusable components, and utility libraries.

## Complexity Tracking

> No violations detected. All constitution principles are satisfied without requiring additional complexity justifications.

---

## Phase 0: Research

### Research Tasks

1. **Better Auth Integration Pattern**
   - Research how Better Auth integrates with Next.js 16+ App Router
   - Determine JWT token storage strategy (cookie vs localStorage)
   - Understand Better Auth session management and token refresh

2. **API Client Architecture**
   - Research best practices for HTTP client with JWT authentication
   - Evaluate React Query vs SWR for data fetching
   - Determine error handling and retry strategy

3. **State Management**
   - Research optimal state management for task CRUD operations
   - Evaluate Context API vs Zustand vs React Query for task state
   - Determine optimistic update strategy

4. **Responsive Design Patterns**
   - Research Tailwind CSS mobile-first patterns
   - Determine breakpoint strategy for dashboard layout
   - Identify accessibility best practices for touch targets

5. **Testing Strategy**
   - Research Jest + React Testing Library setup for Next.js 16+
   - Determine E2E testing approach (Playwright vs Cypress)
   - Identify testing patterns for authentication flows

### Research Findings

See [research.md](./research.md) for detailed findings and decisions.

---

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](./data-model.md) for entity definitions, relationships, and validation rules.

### API Contracts

See [contracts/api-client.md](./contracts/api-client.md) for API client interface definitions and request/response schemas.

### Quick Start Guide

See [quickstart.md](./quickstart.md) for developer setup and project initialization instructions.

---

## Phase 2: Implementation

*To be executed via `/sp.tasks` command which generates detailed task breakdown.*

### Implementation Phases

**Phase 2.1: Project Foundation (P1)**
- Initialize Next.js 16+ project with TypeScript
- Setup Tailwind CSS configuration
- Configure Better Auth
- Setup project structure and base components

**Phase 2.2: Authentication Flow (P1)**
- Implement signup page with form validation
- Implement signin page with error handling
- Create AuthGuard component for route protection
- Implement signout functionality
- Add authentication state management

**Phase 2.3: Task Dashboard Core (P1)**
- Create dashboard page layout
- Implement TaskList component with empty state
- Add TaskItem component with status indicators
- Display task timestamps in user-friendly format
- Implement responsive design for mobile/desktop

**Phase 2.4: Task Operations (P1)**
- Implement task creation form with validation
- Add task completion action
- Create API client functions for task operations
- Add loading states and error handling
- Implement visual feedback for successful operations

**Phase 2.5: Task Management Features (P2)**
- Implement task editing form
- Add task deletion with confirmation dialog
- Create modal component for forms
- Implement optimistic updates for all operations
- Add toast notifications for user feedback

**Phase 2.6: Enhanced Features (P2)**
- Implement task filtering by status
- Add statistics display (total, pending, completed)
- Create header with user info and signout button
- Implement responsive statistics layout

**Phase 2.7: Polish & Testing (P3)**
- Add animations and transitions
- Implement accessibility improvements
- Add unit tests for components
- Add E2E tests for user flows
- Performance optimization
- Error boundary implementation

---

## Dependencies

### Required Libraries

- **next**: ^16.0.0 - Next.js framework
- **react**: ^18.3.0 - React library
- **react-dom**: ^18.3.0 - React DOM
- **typescript**: ^5.0.0 - TypeScript compiler
- **better-auth**: ^1.0.0 - Authentication solution
- **@tanstack/react-query**: ^5.0.0 - Data fetching and state management
- **tailwindcss**: ^3.4.0 - CSS framework
- **@headlessui/react**: ^2.0.0 - Accessible UI components
- **clsx**: ^2.0.0 - Class name utilities
- **tailwind-merge**: ^2.0.0 - Tailwind class merging
- **date-fns**: ^3.0.0 - Date formatting utilities

### Development Dependencies

- **@types/node**: ^20.0.0 - Node.js type definitions
- **@types/react**: ^18.3.0 - React type definitions
- **@types/react-dom**: ^18.3.0 - React DOM type definitions
- **jest**: ^29.7.0 - Testing framework
- **@testing-library/react**: ^14.0.0 - React testing utilities
- **@testing-library/jest-dom**: ^6.0.0 - Jest DOM matchers
- **playwright**: ^1.40.0 - E2E testing
- **eslint**: ^8.56.0 - Linting
- **prettier**: ^3.0.0 - Code formatting

---

## Non-Functional Requirements

### Performance
- Page load time < 3 seconds on 3G connection
- Time to Interactive < 5 seconds
- First Contentful Paint < 1.5 seconds
- Bundle size < 500KB (gzipped)

### Reliability
- 99.9% uptime for frontend application
- Graceful degradation on API failures
- Automatic retry for transient failures
- Proper error boundaries to prevent app crashes

### Security
- All API requests include JWT token
- Token storage in secure httpOnly cookie (preferred) or secure localStorage
- XSS prevention via React's built-in escaping
- CSRF protection via Better Auth
- Secure headers configuration

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and roles
- Minimum touch target size 44x44px

### Maintainability
- TypeScript for type safety
- Component modularity and reusability
- Clear separation of concerns
- Comprehensive code documentation
- Unit test coverage > 80%

---

## Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Better Auth incompatibility with Next.js 16 | Low | High | Research compatibility before implementation; use stable versions |
| Backend API changes breaking contract | Medium | Medium | Use TypeScript types to enforce contract; version API endpoints |
| Performance issues with large task lists | Medium | Medium | Implement pagination or virtual scrolling if needed |
| Token expiration handling complexity | Low | Medium | Implement automatic token refresh with Better Auth |
| Mobile responsiveness issues | Low | Low | Use Tailwind responsive utilities and test on real devices |
| State management complexity | Medium | Low | Use React Query for server state; keep client state minimal |

---

## Success Metrics

- 98% signup completion rate (FR-001, SC-008)
- < 30 seconds average signin time (FR-002, SC-002)
- 95% first task creation success rate (FR-015, SC-003)
- < 2 seconds average task operation time (FR-014-020, SC-004)
- < 1 second dashboard load time for 100 tasks (FR-010, SC-005)
- Responsive design working on devices 320px+ (FR-023, SC-006)
- 90% user task completion without documentation (SC-007)
- 95% correct status indicator recognition (FR-011, SC-009)
- 90% empty state message comprehension (FR-024, SC-010)
