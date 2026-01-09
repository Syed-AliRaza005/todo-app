# Implementation Plan: Phase-2 Full-Stack Web Application Backend

**Branch**: `002-phase-2-backend` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-phase-2-backend/spec.md`

## Summary

Build a production-ready FastAPI backend for a multi-user todo application with JWT authentication, supporting all three hackathon levels (Basic, Intermediate, Advanced). The backend will expose RESTful APIs for user authentication and task management, with strict data isolation between users. Technology stack: Python 3.13+, FastAPI, SQLModel ORM, Neon PostgreSQL, Alembic migrations, python-jose for JWT.

## Technical Context

**Language/Version**: Python 3.13+ (as per constitution)
**Primary Dependencies**: FastAPI 0.115+, SQLModel 0.0.18+, python-jose 3.3.0+, psycopg2-binary 2.9.9+, Alembic 1.13.0+
**Storage**: Neon Serverless PostgreSQL (connection via DATABASE_URL from .env)
**Testing**: pytest with asyncio plugin
**Target Platform**: Linux server (WSL2 verified)
**Project Type**: Web backend (FastAPI application)
**Performance Goals**: Task creation <500ms, retrieval <200ms, concurrent users 100+, JWT validation <50ms
**Constraints**: <200ms p95 latency for API responses, 100MB memory budget
**Scale/Scope**: Single-tenant per user, 1,000 tasks per user expected, 100 concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Evidence |
|-----------|-------------|--------|----------|
| VII. Authentication & Security | JWT-based auth with Bearer tokens | ✅ PASS | FastAPI dependencies will validate `Authorization: Header` on all protected endpoints |
| VIII. Data Isolation & Multi-Tenancy | `/api/{user_id}/tasks` pattern with user_id validation | ✅ PASS | All endpoints will verify `token_user_id == url_user_id` before any operation |
| IX. Modern Full-Stack Architecture | FastAPI + SQLModel + Neon PostgreSQL | ✅ PASS | Already configured in backend/.env with pyproject.toml dependencies |
| Phase-2 Technical Requirements | Alembic migrations, OpenAPI docs | ✅ PASS | alembic/ directory exists, FastAPI auto-generates /docs |
| API Design Requirements | RESTful, proper HTTP status codes, consistent error format | ✅ PASS | Will implement standardized response models |

## Project Structure

### Documentation (this feature)

```text
specs/002-phase-2-backend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (research findings)
├── data-model.md        # Phase 1 output (entity definitions)
├── quickstart.md        # Phase 1 output (setup guide)
├── contracts/           # Phase 1 output (API specifications)
│   └── tasks-api.yaml   # OpenAPI 3.0 specification
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── alembic/                   # Database migrations
│   ├── versions/              # Migration scripts
│   └── env.py                 # Alembic configuration
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py            # User model (SQLModel)
│   │   ├── task.py            # Task model (SQLModel)
│   │   └── token.py           # RevokedToken model
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py          # API route definitions
│   │   ├── auth.py            # Authentication endpoints
│   │   └── tasks.py           # Task CRUD endpoints
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── jwt.py             # JWT encode/decode/validate
│   │   └── password.py        # Password hashing (passlib)
│   ├── database.py            # Database connection (SQLModel engine)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py            # Pydantic schemas for user
│   │   └── task.py            # Pydantic schemas for task
│   ├── dependencies.py        # FastAPI dependencies (get_db, get_current_user)
│   └── main.py                # FastAPI application entry point
├── tests/
│   ├── __init__.py
│   ├── conftest.py            # pytest fixtures
│   ├── test_auth.py           # Authentication tests
│   ├── test_tasks.py          # Task CRUD tests
│   └── test_isolation.py      # Data isolation tests
├── .env                       # Environment variables (already exists)
├── .env.example               # Template for environment
├── pyproject.toml             # Project dependencies
├── README.md                  # Backend documentation
└── uv.lock                    # UV lock file
```

**Structure Decision**: The backend follows the constitution's prescribed structure with dedicated modules for models, API routes, authentication, and database. The existing `backend/` directory already contains the skeleton (alembic/, src/, tests/) and we will fill in the implementation.

## Phase 0: Research Findings

### Decision: JWT Token Revocation Strategy

**Question**: How to handle logout/token revocation server-side?

**Options Considered**:
1. **Token blacklist (Redis/Database)**: Store revoked tokens with expiration
2. **Short token lifetime + refresh tokens**: Require frequent re-authentication
3. **Token versioning**: Include version in token, invalidate by incrementing version

**Decision**: Token blacklist with database table (RevokedToken)

**Rationale**: Simpler than refresh tokens, no additional infrastructure (Redis) required, matches constitution requirement FR-008 for server-side signout. Using short expiration (24h) with server-side revocation covers most security concerns without complexity.

### Decision: Password Hashing Algorithm

**Question**: Which password hashing algorithm to use?

**Options Considered**:
1. **bcrypt**: Widely used, good security, configurable work factor
2. **argon2**: Winner of Password Hashing Competition, more resistant to GPU attacks
3. **scrypt**: Memory-hard, good security properties

**Decision**: bcrypt (via passlib)

**Rationale**: Python-jose integrates seamlessly with passlib bcrypt, sufficient security for this application scope, lower implementation complexity. argon2 would be preferred for higher-security applications.

### Decision: Database Connection Management

**Question**: How to handle database connections in FastAPI?

**Options Considered**:
1. **Request-scoped sessions**: Create session per request, close after response
2. **Connection pooling**: Reuse connections across requests
3. **Background workers**: Separate connection management

**Decision**: SQLModel with request-scoped sessions using FastAPI's dependency injection

**Rationale**: Matches SQLModel/SQLAlchemy best practices, FastAPI's `get_db()` pattern ensures proper cleanup, connection pooling handled by SQLModel engine with configured pool size.

## Complexity Tracking

> No constitution violations requiring justification at this time.

## Implementation Roadmap

### Phase 1: Foundation

1. Configure database connection and SQLModel engine
2. Define User, Task, RevokedToken models
3. Set up Alembic migration scripts
4. Implement JWT authentication utilities
5. Create password hashing utilities

### Phase 2: Authentication API

6. Implement user registration endpoint
7. Implement user login endpoint
8. Implement token revocation/logout endpoint
9. Create JWT validation dependency

### Phase 3: Task CRUD API

10. Implement GET tasks (with filtering)
11. Implement POST task
12. Implement PUT task
13. Implement DELETE task
14. Implement PATCH complete endpoint

### Phase 4: Advanced Features

15. Implement bulk complete endpoint
16. Implement bulk delete endpoint
17. Implement task statistics endpoint

### Phase 5: Testing & Documentation

18. Write unit tests for all endpoints
19. Write integration tests for data isolation
20. Verify OpenAPI documentation at /docs
