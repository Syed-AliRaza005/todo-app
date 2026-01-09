# Tasks: Backend CRUD API

**Input**: Design documents from plan.md, spec.md, data-model.md, contracts/
**Prerequisites**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
**Tests**: Tests are OPTIONAL - not included in this specification
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story
**Implementation Strategy**: MVP First (US1 + US2) → Incremental Delivery

## Format: [ID] [P?] [Story?] Description

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Project initialization and basic structure

**Goal**: Create backend directory structure, install dependencies, and configure environment

### Tasks

- [ ] T001 Create backend directory structure per implementation plan
  Path: `backend/src/{models,api,database} backend/tests backend/alembic/versions`
- [ ] T002 Initialize Python project with uv
  Path: backend/
  Command: `uv init` in backend directory
- [ ] T003 Install FastAPI and database dependencies
  Path: backend/pyproject.toml
  Packages: fastapi, uvicorn[standard], sqlmodel, psycopg2-binary, alembic, python-jose[cryptography], pydantic, pydantic-settings
- [ ] T004 Install testing dependencies
  Path: backend/pyproject.toml
  Packages: pytest, pytest-asyncio, httpx, httpx-asyncio
- [ ] T005 Create .env.example file with database and JWT configuration
  Path: backend/.env.example
  Content: DATABASE_URL, BETTER_AUTH_SECRET, APP_NAME, DEBUG
- [ ] T006 Create pyproject.toml with project metadata
  Path: backend/pyproject.toml
  Content: Project name, version, dependencies list

**Checkpoint**: Backend project initialized with all dependencies and environment configuration ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Goal**: Establish database connection, JWT authentication middleware, and error handling system

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tasks

- [ ] T007 Create database configuration module
  Path: backend/src/database/config.py
  Function: Load DATABASE_URL from environment and configure SQLAlchemy engine
- [ ] T008 Create database connection module
  Path: backend/src/database/connection.py
  Function: Async database session factory with connection pooling
- [ ] T009 Initialize Alembic configuration
  Path: backend/alembic.ini and backend/alembic/env.py
  Function: Configure Alembic to connect to Neon PostgreSQL
- [ ] T010 Create initial database migration
  Path: backend/alembic/versions/001_initial_schema.py
  Function: Generate users and tasks tables with proper indexes and constraints
- [ ] T011 Apply database migrations
  Command: `alembic upgrade head` in backend directory
  Function: Create tables in Neon PostgreSQL
- [ ] T012 Create JWT verification dependency
  Path: backend/src/api/dependencies.py
  Function: FastAPI dependency to verify Authorization header and extract user_id
- [ ] T013 Create error handlers module
  Path: backend/src/api/errors.py
  Function: Global exception handlers for 401, 403, 404, 422 errors
- [ ] T014 Create FastAPI application entry point
  Path: backend/src/main.py
  Function: Initialize FastAPI app, register routes, add middleware, configure CORS

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Task Creation (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks with titles, descriptions, and initial status

**Why this priority**: Task creation is foundational capability. Without this, no other task management operations are possible. This provides immediate value to users by allowing them to capture and track their to-do items.

**Independent Test**: Can be fully tested by creating a task via API and verifying it's stored correctly with all required fields populated.

### Tasks

- [ ] T015 [US1] Create Task model in backend/src/models/task.py
  Entity: Task with UUID, user_id, title, description, status, timestamps
  Fields: id, user_id (FK), title, description, status, created_at, completed_at, updated_at
- [ ] T016 [US1] Create task creation endpoint in backend/src/api/routes.py
  Path: backend/src/api/routes.py
  Endpoint: POST /api/{user_id}/tasks
  Auth: Requires JWT verification
  Validation: Title required (max 500 chars), description optional
  Response: 201 with created Task object, 422 on validation error
- [ ] T017 [US1] Add task creation endpoint to FastAPI app
  Path: backend/src/main.py
  Function: Register POST /api/{user_id}/tasks route with JWT dependency

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Task Listing (Priority: P1) 🎯 MVP

**Goal**: Enable users to view all their tasks, optionally filtered by status

**Why this priority**: Users need to see their tasks to manage them. Without listing capability, created tasks are effectively invisible. This is essential for any task management workflow.

**Independent Test**: Can be fully tested by creating multiple tasks and retrieving them via API to verify correct retrieval and filtering.

### Tasks

- [ ] T018 [US2] Add task listing endpoint in backend/src/api/routes.py
  Path: backend/src/api/routes.py
  Endpoint: GET /api/{user_id}/tasks
  Query param: status (optional: 'Pending', 'Completed', 'All')
  Auth: Requires JWT verification
  Validation: user_id in URL must match JWT user_id
  Response: 200 with array of tasks, 403 on cross-user access
- [ ] T019 [US2] Add task listing endpoint to FastAPI app
  Path: backend/src/main.py
  Function: Register GET /api/{user_id}/tasks route

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can create and list tasks.

---

## Phase 5: User Story 3 - Task Completion (Priority: P2)

**Goal**: Enable users to mark their tasks as completed

**Why this priority**: Task completion is a core workflow action. Users need to track progress and mark items as done to maintain a clear view of remaining work.

**Independent Test**: Can be fully tested by creating a task, marking it as completed, and verifying status change and completion timestamp are recorded.

### Tasks

- [ ] T020 [US3] Add task completion endpoint in backend/src/api/routes.py
  Path: backend/src/api/routes.py
  Endpoint: PATCH /api/{user_id}/tasks/{task_id}/complete
  Auth: Requires JWT verification
  Validation: task must belong to user, status changes to 'Completed'
  Response: 200 with updated Task, 403 on cross-user access, 404 if task not found
- [ ] T021 [US3] Add task completion endpoint to FastAPI app
  Path: backend/src/main.py
  Function: Register PATCH /api/{user_id}/tasks/{task_id}/complete route

**Checkpoint**: At this point, Users 1-3 should all work independently

---

## Phase 6: User Story 4 - Task Updates (Priority: P2)

**Goal**: Enable users to modify task details including title, description, and status

**Why this priority**: Users need to correct mistakes and update task information as requirements change. This flexibility is essential for practical task management.

**Independent Test**: Can be fully tested by creating a task, updating various fields, and verifying only specified fields are modified.

### Tasks

- [ ] T022 [US4] Add task update endpoint in backend/src/api/routes.py
  Path: backend/src/api/routes.py
  Endpoint: PUT /api/{user_id}/tasks/{task_id}
  Body: { title?, description?, status? }
  Auth: Requires JWT verification
  Validation: task must belong to user, status must be 'Pending' or 'Completed'
  Response: 200 with updated Task, 403 on cross-user access, 404 if task not found, 422 on validation error
- [ ] T023 [US4] Add task update endpoint to FastAPI app
  Path: backend/src/main.py
  Function: Register PUT /api/{user_id}/tasks/{task_id} route

**Checkpoint**: At this point, Users 1-4 should all work independently

---

## Phase 7: User Story 5 - Task Deletion (Priority: P3)

**Goal**: Enable users to delete their tasks when no longer needed

**Why this priority**: Users need to remove completed, cancelled, or obsolete tasks to maintain an organized task list. While less frequent than create/list/complete operations, deletion is necessary for data hygiene.

**Independent Test**: Can be fully tested by creating a task, deleting it, and verifying it no longer appears in listings.

### Tasks

- [ ] T024 [US5] Add task retrieval endpoint in backend/src/api/routes.py
  Path: backend/src/api/routes.py
  Endpoint: GET /api/{user_id}/tasks/{task_id}
  Auth: Requires JWT verification
  Validation: task must belong to user
  Response: 200 with Task object, 403 on cross-user access, 404 if task not found
- [ ] T025 [US5] Add task deletion endpoint in backend/src/api/routes.py
  Path: backend/src/api/routes.py
  Endpoint: DELETE /api/{user_id}/tasks/{task_id}
  Auth: Requires JWT verification
  Validation: task must belong to user
  Response: 204 No Content, 403 on cross-user access, 404 if task not found
- [ ] T026 [US5] Add task retrieval and deletion endpoints to FastAPI app
  Path: backend/src/main.py
  Function: Register GET and DELETE routes for /api/{user_id}/tasks/{task_id}

**Checkpoint**: At this point, all user stories (US1-US5) should be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Tasks

- [ ] T027 [P] Create tests/__init__.py file
  Path: backend/tests/__init__.py
  Content: Test package initialization
- [ ] T028 [P] Create conftest.py with test fixtures
  Path: backend/tests/conftest.py
  Function: Database session fixture, test client fixture
- [ ] T029 [P] Configure pyproject.toml for pytest
  Path: backend/pyproject.toml
  Content: pytest configuration, test discovery patterns
- [ ] T030 [P] Add documentation to README.md
  Path: backend/README.md
  Content: Setup instructions, API documentation link, environment variables guide
- [ ] T031 [P] Update .gitignore for Python
  Path: backend/.gitignore
  Content: __pycache__, .env, *.pyc, .pytest_cache, htmlcov/

**Checkpoint**: Code polished, tested, and documented - ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (Setup): No dependencies
- **Phase 2** (Foundational): BLOCKS all user stories - must complete first
- **Phase 3** (US1 - Task Creation): Depends on Phase 2 completion
- **Phase 4** (US2 - Task Listing): Depends on Phase 2 completion
- **Phase 5** (US3 - Task Completion): Depends on Phase 2 completion
- **Phase 6** (US4 - Task Updates): Depends on Phase 2 completion
- **Phase 7** (US5 - Task Deletion): Depends on Phase 2 completion
- **Phase 8** (Polish): Depends on all user stories completion

### Within Each User Story Phase

**Test → Model → Service → Endpoint** flow where applicable:
1. Tests first (if requested) - write and FAIL
2. Models create service dependencies
3. Services depend on models
4. Endpoints register with FastAPI

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T003, T004, T005, T006 can run in parallel (different files)

**After Foundational Phase (Phase 2 completes)**:
- User stories (Phases 3-7) can proceed in parallel if team capacity allows
- Different users can implement different stories concurrently

**Testing (if tests requested)**:
- T028, T029, T030 can run in parallel
- Test tasks can be written and executed per user story as story is developed

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 - Task Creation
4. **STOP and VALIDATE**: Test Task Creation and Listing independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Phase 3)
   - Developer B: User Story 2 (Phase 4)
   - Developer C: User Story 3 (Phase 5)
   - Developer D: User Story 4 (Phase 6)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story from spec.md
- Each user story should be independently completable and testable
- Verify tests fail before implementing (if tests requested)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
