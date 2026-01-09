# Implementation Plan: Backend CRUD API

**Branch**: `001-backend-crud-api` | **Date**: 2026-01-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-backend-crud-api/spec.md`

## Summary

Implement a RESTful API for task management with full CRUD operations, user authentication, and strict data isolation. The API will provide endpoints for creating, reading, updating, and deleting tasks while ensuring users can only access their own data. Authentication uses JWT tokens, and data is persisted in PostgreSQL via SQLModel ORM.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: FastAPI, SQLModel, PostgreSQL, Pydantic, Alembic, python-jose (JWT), uvicorn
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest, pytest-asyncio, httpx
**Target Platform**: Linux server (Docker containerizable)
**Project Type**: web (backend API component)
**Performance Goals**:
- Task creation: <500ms average (p95)
- Task retrieval: <200ms for users with up to 1,000 tasks
- Support 100 concurrent users with <10% performance degradation
**Constraints**:
- All endpoints require JWT authentication
- Data isolation enforced at API layer
- Database connection pooling for concurrent access
- Proper HTTP status codes (201, 200, 204, 401, 403, 404, 422)
**Scale/Scope**:
- Support up to 100 concurrent users
- Handle up to 1,000 tasks per user efficiently
- 99.9% data integrity across database restarts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase-2 Constitution Principles (Applicable to this feature)

#### Principle VII: Authentication & Security
✅ **PASS**: All API endpoints will be protected with JWT-based authentication
- FastAPI dependency will verify JWT from `Authorization: Bearer <token>` header
- Shared `BETTER_AUTH_SECRET` environment variable between frontend and backend
- Invalid/expired tokens return 401 Unauthorized

#### Principle VIII: Data Isolation & Multi-Tenancy
✅ **PASS**: Every task is linked to `user_id` field
- API endpoints follow pattern: `/api/{user_id}/tasks`
- Backend validates `JWT user_id` == `URL param user_id` on every request
- Cross-user access returns 403 Forbidden
- Database foreign key enforces ownership

#### Principle IX: Modern Full-Stack Architecture
✅ **PASS**: Using constitution-defined tech stack
- Backend: Python FastAPI with SQLModel ORM
- Database: Neon Serverless PostgreSQL
- RESTful endpoints with proper status codes
- Structured error responses

#### Principle X: User Experience Standards
✅ **PASS**: API design supports modern UI requirements
- Tasks display timestamps (created_at, completed_at)
- Status indicators (Complete/Pending)
- Empty states with friendly messages (404 responses)
- Error messages provide actionable guidance

**Constitution Status**: ✅ All gates passed. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-crud-api/
├── plan.md              # This file
├── research.md          # Phase 0 output (technical research)
├── data-model.md        # Phase 1 output (entity definitions)
├── quickstart.md        # Phase 1 output (dev setup guide)
├── contracts/           # Phase 1 output (API specifications)
│   ├── tasks-api.yaml   # OpenAPI specification
│   └── validation-rules.md
└── tasks.md             # Phase 2 output (implementation tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py           # Task model (SQLModel)
│   │   └── user.py           # User model reference (auth system)
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py         # Task CRUD endpoints
│   │   ├── dependencies.py   # JWT verification dependency
│   │   └── errors.py         # Exception handlers
│   ├── database/
│   │   ├── __init__.py
│   │   ├── connection.py     # PostgreSQL connection
│   │   └── config.py         # Database configuration
│   └── main.py               # FastAPI application entry point
├── alembic/
│   ├── versions/
│   │   └── 001_initial_schema.py
│   └── env.py
├── alembic.ini
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py          # JWT verification tests
│   ├── test_tasks_api.py     # CRUD endpoint tests
│   └── test_data_isolation.py# Cross-user access prevention tests
├── pyproject.toml
└── .env.example
```

**Structure Decision**: Backend-focused implementation in `/backend` directory using FastAPI framework. Database schema managed via Alembic migrations. Tests organized by functionality (auth, CRUD, data isolation). This structure aligns with Phase-2 constitution's full-stack architecture plan where backend and frontend are separate components.

## Complexity Tracking

No constitution violations requiring justification. Implementation follows constitution-mandated technology stack and architectural principles.
