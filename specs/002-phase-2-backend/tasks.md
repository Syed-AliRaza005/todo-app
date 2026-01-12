# Tasks: Phase-2 Full-Stack Web Application Backend

**Input**: Design documents from plan.md, spec.md, data-model.md, contracts/
**Prerequisites**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
**Tests**: Tests are included - write tests FIRST, ensure they FAIL before implementation
**Organization**: Tasks are grouped by user story to enable independent implementation and testing
**Implementation Strategy**: MVP First (US1 + US2 + US4) → Incremental Delivery → Advanced (US3 + US5)

## Format: [ID] [P?] [Story?] Description

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Project initialization and basic structure

**Goal**: Verify and update backend directory structure, install dependencies, configure environment

### Tasks

- [ ] T001 Verify backend directory structure
  Path: `backend/src/{models,api,auth,schemas,database} backend/tests backend/alembic/versions`
  Check: Ensure all directories exist per plan.md structure

- [ ] T002 Install passlib for password hashing
  Path: backend/pyproject.toml
  Command: `uv add passlib[bcrypt]`
  Note: Existing deps (fastapi, sqlmodel, alembic, python-jose, psycopg2-binary) are already installed

- [ ] T003 Update .env with BETTER_AUTH_SECRET
  Path: backend/.env
  Action: Add `BETTER_AUTH_SECRET=<generate-32-char-secret>` and `JWT_EXPIRATION_HOURS=24`
  Validation: Verify secret is 32+ characters

- [ ] T004 Configure pytest in pyproject.toml
  Path: backend/pyproject.toml
  Content:
  ```toml
  [tool.pytest]
  pytest_plugins = ["asyncio"]
  [tool.pytest.ini_options]
  testpaths = ["tests"]
  python_files = ["test_*.py"]
  python_functions = ["test_*"]
  ```

**Checkpoint**: Backend project structure verified, all dependencies installed, environment configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Goal**: Establish database connection, JWT authentication middleware, error handling, and data models

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tasks

- [ ] T005 Create database connection module
  Path: backend/src/database.py
  Content:
  - Load DATABASE_URL from environment
  - Create SQLModel engine with connection pooling
  - Define get_db() dependency for FastAPI
  - Pool config: pool_size=10, max_overflow=20

- [ ] T006 [P] Create User model
  Path: backend/src/models/user.py
  Entity: User with id (UUID), email, password_hash, name, created_at, updated_at
  Relationships: One-to-Many with Task (cascade_delete="all")

- [ ] T007 [P] Create Task model
  Path: backend/src/models/task.py
  Entity: Task with id (UUID), user_id (FK), title, description, status, created_at, completed_at, updated_at
  Relationships: Many-to-One with User

- [ ] T008 [P] Create RevokedToken model
  Path: backend/src/models/token.py
  Entity: RevokedToken with token_jti (PK), user_id (FK), expires_at

- [ ] T009 Create models __init__.py
  Path: backend/src/models/__init__.py
  Content: Export User, Task, RevokedToken

- [ ] T010 Create password hashing utilities
  Path: backend/src/auth/password.py
  Content:
  - hash_password(password: str) -> str
  - verify_password(plain_password: str, hashed_password: str) -> bool
  - Use bcrypt via passlib

- [ ] T011 Create JWT utilities
  Path: backend/src/auth/jwt.py
  Content:
  - create_access_token(user_id: UUID, expires_delta: timedelta) -> str
  - decode_access_token(token: str) -> dict with "sub" claim
  - extract_token_jti(token: str) -> str
  - Use BETTER_AUTH_SECRET, HS256 algorithm, 24h expiration

- [ ] T012 Create JWT validation dependency
  Path: backend/src/dependencies.py
  Content:
  - get_current_user(authorization: str) -> UUID
  - Validate Bearer token format
  - Return user_id from JWT "sub" claim
  - Raise HTTPException(401) for invalid/expired tokens

- [ ] T013 Create Pydantic schemas for authentication
  Path: backend/src/schemas/user.py
  Content:
  - UserCreate (email, password, name)
  - UserLogin (email, password)
  - AuthResponse (access_token, token_type, user_id)
  - UserResponse (id, email, name, created_at)

- [ ] T014 Create Pydantic schemas for tasks
  Path: backend/src/schemas/task.py
  Content:
  - TaskCreate (title, description optional)
  - TaskUpdate (title optional, description optional, status optional)
  - TaskResponse (all task fields)
  - TaskListResponse (tasks array, total, pending_count, completed_count)
  - BulkTaskIdsRequest (task_ids array)
  - TaskStatisticsResponse (total, pending, completed)

- [ ] T015 Create schemas __init__.py
  Path: backend/src/schemas/__init__.py
  Content: Export all schemas from user.py and task.py

- [ ] T016 Create error handlers module
  Path: backend/src/api/errors.py
  Content:
  - ErrorResponse schema (error, message, details)
  - HTTPException handlers for consistent error format
  - Validation error handler (422)
  - Auth error handler (401)
  - Forbidden error handler (403)

- [ ] T017 Initialize Alembic configuration
  Path: backend/alembic/ini and backend/alembic/env.py
  Content: Configure Alembic to connect to Neon PostgreSQL using DATABASE_URL
  Reference: data-model.md for table definitions

- [ ] T018 Create initial database migration
  Path: backend/alembic/versions/001_initial_schema.py
  Content: Generate users, tasks, and revoked_tokens tables with proper indexes
  Reference: data-model.md SQL definitions

- [ ] T019 Apply database migrations
  Command: `cd backend && alembic upgrade head`
  Validation: Verify tables created in Neon PostgreSQL

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to register, sign in, and sign out using JWT authentication

**Why this priority**: Authentication is the foundation of a multi-user application. Required for all hackathon levels.

**Independent Test**: Can be fully tested by registering a user, logging in, and using the token for subsequent requests.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T020 [US1] Create conftest.py with test fixtures
  Path: backend/tests/conftest.py
  Content:
  - test_db fixture (session with rollback)
  - test_client fixture (AsyncClient with override)
  - test_user fixture (create user in db)
  - test_auth_header fixture (generate valid JWT)

- [ ] T021 [US1] Contract test for user registration
  Path: backend/tests/test_auth.py
  Content: Test POST /auth/register with valid/invalid data
  Cases: 201 created, 400 email exists, 422 validation error

- [ ] T022 [US1] Contract test for user login
  Path: backend/tests/test_auth.py
  Content: Test POST /auth/login with valid/invalid credentials
  Cases: 200 with token, 401 invalid password

- [ ] T023 [US1] Contract test for logout
  Path: backend/tests/test_auth.py
  Content: Test POST /auth/logout invalidates token
  Cases: 200 success, 401 without token

### Implementation for User Story 1

- [ ] T024 [US1] Create authentication API routes
  Path: backend/src/api/auth.py
  Endpoints:
  - POST /auth/register (UserCreate) -> AuthResponse
  - POST /auth/login (UserLogin) -> AuthResponse
  - POST /auth/logout -> {message: str}
  Auth: None for register/login, Bearer for logout

- [ ] T025 [US1] Implement user registration logic
  Path: backend/src/api/auth.py
  Logic:
  - Validate email format (Pydantic)
  - Check email uniqueness in db
  - Hash password with bcrypt
  - Create User record
  - Generate JWT with user_id
  Return: 201 with access_token, user_id

- [ ] T026 [US1] Implement user login logic
  Path: backend/src/api/auth.py
  Logic:
  - Find user by email
  - Verify password with bcrypt
  - Generate JWT with user_id
  Return: 200 with access_token, user_id
  Error: 401 if user not found or password invalid

- [ ] T027 [US1] Implement logout logic
  Path: backend/src/api/auth.py
  Logic:
  - Extract token JTI
  - Get token expiration
  - Create RevokedToken record
  Return: 200 success message

- [ ] T028 [US1] Register auth routes in FastAPI app
  Path: backend/src/main.py
  Content: Include router from api.auth with prefix "/auth"

**Checkpoint**: User authentication working - users can register, login, logout with JWT tokens

---

## Phase 4: User Story 2 - Task CRUD Operations (Priority: P1) 🎯 MVP

**Goal**: Enable users to create, read, update, and delete their own tasks

**Why this priority**: Task CRUD is the core functionality of the application. Required for all hackathon levels.

**Independent Test**: Can be fully tested by creating a task, retrieving it, updating it, and deleting it with JWT auth.

### Tests for User Story 2

- [ ] T029 [US2] Contract test for task creation
  Path: backend/tests/test_tasks.py
  Content: Test POST /api/{user_id}/tasks
  Cases: 201 created, 400 bad request, 401 unauthorized, 403 user mismatch

- [ ] T030 [US2] Contract test for task listing
  Path: backend/tests/test_tasks.py
  Content: Test GET /api/{user_id}/tasks
  Cases: 200 with array, 401 unauthorized, 403 user mismatch

- [ ] T031 [US2] Contract test for task retrieval
  Path: backend/tests/test_tasks.py
  Content: Test GET /api/{user_id}/tasks/{task_id}
  Cases: 200 with task, 401 unauthorized, 403 user mismatch, 404 not found

- [ ] T032 [US2] Contract test for task update
  Path: backend/tests/test_tasks.py
  Content: Test PUT /api/{user_id}/tasks/{task_id}
  Cases: 200 updated, 401 unauthorized, 403 user mismatch, 404 not found, 422 validation

- [ ] T033 [US2] Contract test for task deletion
  Path: backend/tests/test_tasks.py
  Content: Test DELETE /api/{user_id}/tasks/{task_id}
  Cases: 204 no content, 401 unauthorized, 403 user mismatch, 404 not found

### Implementation for User Story 2

- [ ] T034 [US2] Create task API routes
  Path: backend/src/api/tasks.py
  Endpoints:
  - GET /api/{user_id}/tasks (status filter query param)
  - POST /api/{user_id}/tasks
  - GET /api/{user_id}/tasks/{task_id}
  - PUT /api/{user_id}/tasks/{task_id}
  - DELETE /api/{user_id}/tasks/{task_id}
  Auth: Bearer token required, validate user_id matches JWT

- [ ] T035 [US2] Implement task creation endpoint
  Path: backend/src/api/tasks.py
  Logic:
  - Validate user_id matches JWT (403 if mismatch)
  - Validate title present (422 if missing)
  - Create Task with user_id, title, description, status="Pending"
  - Set created_at timestamp
  Return: 201 with created Task

- [ ] T036 [US2] Implement task listing endpoint
  Path: backend/src/api/tasks.py
  Logic:
  - Validate user_id matches JWT (403 if mismatch)
  - Query tasks for user_id
  - Apply status filter if provided (Pending/Completed/All)
  - Sort by created_at DESC
  - Count pending and completed
  Return: 200 with TaskListResponse

- [ ] T037 [US2] Implement task retrieval endpoint
  Path: backend/src/api/tasks.py
  Logic:
  - Validate user_id matches JWT (403 if mismatch)
  - Find task by id
  - Return 404 if not found
  Return: 200 with Task

- [ ] T038 [US2] Implement task update endpoint
  Path: backend/src/api/tasks.py
  Logic:
  - Validate user_id matches JWT (403 if mismatch)
  - Find task by id (404 if not found)
  - Update only provided fields (title, description, status)
  - Update updated_at timestamp
  - Handle status transitions (set/completed_at)
  Return: 200 with updated Task

- [ ] T039 [US2] Implement task deletion endpoint
  Path: backend/src/api/tasks.py
  Logic:
  - Validate user_id matches JWT (403 if mismatch)
  - Find task by id (404 if not found)
  - Delete task (hard delete)
  Return: 204 No Content

- [ ] T040 [US2] Register task routes in FastAPI app
  Path: backend/src/main.py
  Content: Include router from api.tasks with prefix "/api"

**Checkpoint**: Task CRUD operations working - users can create, list, retrieve, update, and delete their own tasks

---

## Phase 5: User Story 3 - Task Filtering and Status Management (Priority: P2)

**Goal**: Enable users to filter tasks by status and mark tasks as complete/pending

**Why this priority**: Enables users to organize and track their progress. Part of Intermediate/Advanced levels.

**Independent Test**: Can be fully tested by creating tasks with different statuses and verifying filtering.

### Tests for User Story 3

- [ ] T041 [US3] Contract test for status filtering
  Path: backend/tests/test_tasks.py
  Content: Test GET /api/{user_id}/tasks?status={value}
  Cases: Returns only pending tasks, Returns only completed tasks, Invalid status returns 422

- [ ] T042 [US3] Contract test for mark complete endpoint
  Path: backend/tests/test_tasks.py
  Content: Test PATCH /api/{user_id}/tasks/{task_id}/complete
  Cases: 200 with completed task, 403 user mismatch, 404 not found

### Implementation for User Story 3

- [ ] T043 [US3] Implement PATCH /complete endpoint
  Path: backend/src/api/tasks.py
  Logic:
  - Validate user_id matches JWT (403 if mismatch)
  - Find task by id (404 if not found)
  - Set status="Completed"
  - Set completed_at=datetime.utcnow()
  - Set updated_at=datetime.utcnow()
  Return: 200 with updated Task

- [ ] T044 [US3] Verify status filtering in GET /tasks
  Path: backend/src/api/tasks.py
  Logic:
  - Parse status query param (Pending/Completed/All)
  - If "Pending": where(status=="Pending")
  - If "Completed": where(status=="Completed")
  - If "All" or missing: no filter
  Return: Filtered task list

**Checkpoint**: Task filtering and status management working - users can filter by status and mark complete

---

## Phase 6: User Story 4 - Data Isolation Verification (Priority: P1)

**Goal**: Verify and enforce that users cannot access other users' tasks

**Why this priority**: Critical security requirement. Required for all hackathon levels.

**Independent Test**: Can be tested by creating two users, creating tasks for each, and verifying cross-user access is denied.

### Tests for User Story 4

- [ ] T045 [US4] Integration test for cross-user task access
  Path: backend/tests/test_isolation.py
  Content: Test that User A cannot access User B's tasks
  Cases:
  - GET /api/{userB_id}/tasks with User A token -> 403
  - GET /api/{userB_id}/tasks/{taskB_id} with User A token -> 403
  - PUT /api/{userB_id}/tasks/{taskB_id} with User A token -> 403
  - DELETE /api/{userB_id}/tasks/{taskB_id} with User A token -> 403
  - POST /api/{userB_id}/tasks with User A token -> 403

- [ ] T046 [US4] Integration test for user_id mismatch
  Path: backend/tests/test_isolation.py
  Content: Test that JWT user_id must match URL user_id
  Cases: Various combinations of valid tokens with mismatched URLs

### Implementation for User Story 4

- [ ] T047 [US4] Add user_id validation to all endpoints
  Path: backend/src/dependencies.py
  Content: Create get_current_user_id() dependency that:
  - Validates JWT and extracts user_id
  - Compares with URL parameter user_id
  - Raises HTTPException(403) if mismatch

- [ ] T048 [US4] Update all task endpoints to use validation
  Path: backend/src/api/tasks.py
  Content: Apply user_id validation dependency to all endpoints

**Checkpoint**: Data isolation enforced - all cross-user access attempts return 403

---

## Phase 7: User Story 5 - Bulk Operations and Analytics (Priority: P3)

**Goal**: Enable users to perform bulk operations and view task statistics

**Why this priority**: Advanced functionality for power users. Part of Advanced hackathon level.

**Independent Test**: Can be tested by creating multiple tasks and verifying bulk operations work.

### Tests for User Story 5

- [ ] T049 [US5] Contract test for bulk complete
  Path: backend/tests/test_tasks.py
  Content: Test POST /api/{user_id}/tasks/bulk/complete
  Cases: 200 with updated count, 400 invalid task ids, 403 user mismatch

- [ ] T050 [US5] Contract test for bulk delete
  Path: backend/tests/test_tasks.py
  Content: Test POST /api/{user_id}/tasks/bulk/delete
  Cases: 200 with deleted count, 400 invalid task ids, 403 user mismatch

- [ ] T051 [US5] Contract test for task statistics
  Path: backend/tests/test_tasks.py
  Content: Test GET /api/{user_id}/tasks/statistics
  Cases: 200 with counts, 403 user mismatch

### Implementation for User Story 5

- [ ] T052 [US5] Implement POST /bulk/complete endpoint
  Path: backend/src/api/tasks.py
  Logic:
  - Validate user_id matches JWT (403 if mismatch)
  - Validate all task_ids belong to user (403 if any don't)
  - Update each task: status="Completed", completed_at=now, updated_at=now
  Return: {message: "X tasks marked as completed", updated_count: X}

- [ ] T053 [US5] Implement POST /bulk/delete endpoint
  Path: backend/src/api/tasks.py
  Logic:
  - Validate user_id matches JWT (403 if mismatch)
  - Validate all task_ids belong to user (403 if any don't)
  - Delete each task
  Return: {message: "X tasks deleted", deleted_count: X}

- [ ] T054 [US5] Implement GET /statistics endpoint
  Path: backend/src/api/tasks.py
  Logic:
  - Validate user_id matches JWT (403 if mismatch)
  - Count total tasks
  - Count pending tasks
  - Count completed tasks
  Return: {total: X, pending: Y, completed: Z}

**Checkpoint**: Bulk operations and analytics working - users can batch process tasks and view statistics

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Tasks

- [ ] T055 [P] Create tests/__init__.py
  Path: backend/tests/__init__.py
  Content: Test package initialization

- [ ] T056 [P] Add documentation to README.md
  Path: backend/README.md
  Content: Setup instructions, API documentation link (/docs), environment variables guide

- [ ] T057 [P] Verify OpenAPI documentation
  Command: Start server and visit http://localhost:8000/docs
  Validation: All endpoints documented with schemas

- [ ] T058 [P] Run full test suite
  Command: pytest backend/tests/ -v --tb=short
  Validation: All tests pass (31 tests expected)

**Checkpoint**: Code polished, tested, and documented - ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Setup) | None | Phase 2 |
| Phase 2 (Foundational) | Phase 1 | All User Stories |
| Phase 3 (US1 - Auth) | Phase 2 | Phase 4+ |
| Phase 4 (US2 - CRUD) | Phase 2 | Phase 5+ |
| Phase 5 (US3 - Filtering) | Phase 2 | Phase 7 |
| Phase 6 (US4 - Isolation) | Phase 2 | Phase 7 |
| Phase 7 (US5 - Bulk/Stats) | Phases 3-6 | Phase 8 |
| Phase 8 (Polish) | Phases 3-7 | Done |

### Within Each User Story

**Test → Model → Service → Endpoint** flow:
1. Tests first - write and FAIL
2. Models create service dependencies
3. Services depend on models
4. Endpoints register with FastAPI

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T002, T003, T004 can run in parallel

**Foundational Phase (Phase 2)**:
- T005, T006, T007, T008 can run in parallel (different models)
- T010, T011 can run in parallel (auth utilities)
- T013, T014 can run in parallel (schemas)

**After Foundational Phase (Phase 2 completes)**:
- User stories (Phases 3-7) can proceed in parallel if team capacity allows

---

## Implementation Strategy

### MVP First (US1 + US2 + US4)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 - Authentication
4. Complete Phase 4: User Story 2 - Task CRUD
5. Complete Phase 6: User Story 4 - Data Isolation
6. **STOP and VALIDATE**: Core functionality working
7. Deploy/demo MVP (Basic + Intermediate levels covered)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 → Test → Deploy (Authentication)
3. Add US2 → Test → Deploy (Task CRUD)
4. Add US4 → Test → Deploy (Data Isolation)
5. Add US3 → Test → Deploy (Filtering - Intermediate)
6. Add US5 → Test → Deploy (Bulk/Stats - Advanced)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Phase 3)
   - Developer B: User Story 2 (Phase 4)
   - Developer C: User Story 3 + 5 (Phases 5 + 7)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story from spec.md
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Test Summary

| Story | Tests | Description |
|-------|-------|-------------|
| US1 | T020-T023 | Auth registration, login, logout |
| US2 | T029-T033 | Task CRUD operations |
| US3 | T041-T042 | Status filtering and completion |
| US4 | T045-T046 | Data isolation verification |
| US5 | T049-T051 | Bulk operations and statistics |
| Other | T020, T028 | conftest.py, README |

**Total: 26 test tasks + 32 implementation tasks = 58 tasks**
