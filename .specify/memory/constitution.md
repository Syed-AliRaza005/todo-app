<!--
Sync Impact Report:
Version: 1.0.0 → 2.0.0
Changes: Added Phase-2 Full-Stack Web App requirements
Modified Principles: None (Phase-1 principles preserved)
Added Sections: Phase-2 Requirements, Authentication Logic, Tech Stack for Full-Stack, Data Isolation Rules
Templates Status: ✅ No changes needed to plan/spec/tasks templates
Follow-up TODOs: None
-->

# Todo App Project Constitution

## Phase-1: Console Todo Application

This constitution governs the development of a Python-based CLI Todo application with persistent storage and rich UI capabilities.

## Core Principles

### I. Data Persistence & Integrity
**MUST preserve user data across application restarts.**
- All tasks MUST be saved to `tasks.json` immediately after any modification (add, update, delete, complete, clear).
- Application MUST load existing tasks from `tasks.json` on startup.
- JSON file MUST be formatted and human-readable for debugging purposes.
- Data corruption MUST be handled gracefully with error messages and fallback to empty state.

**Rationale**: Users expect their data to persist. Immediate writes prevent data loss from crashes or unexpected shutdowns.

### II. ID Stability & Counter Management
**Task IDs MUST remain stable and predictable.**
- Deleting a task MUST NOT renumber or reassign IDs of remaining tasks.
- ID counter MUST only increment when new tasks are created.
- `clear` command is the ONLY operation that resets the ID counter back to 1.
- ID assignment MUST be deterministic and sequential.

**Rationale**: Stable IDs enable reliable task referencing and prevent user confusion when tasks are deleted.

### III. Timestamp Accuracy
**Every task MUST capture creation timestamp automatically.**
- Format: `YYYY-MM-DD HH:MM:SS` (24-hour format).
- Timestamps MUST be captured at task creation time, not at save time.
- Timestamps MUST be immutable after creation.
- System timezone is used; no timezone conversion required for Phase-1.

**Rationale**: Timestamps provide audit trail and help users track when tasks were created.

### IV. Rich User Interface
**CLI interface MUST be visually appealing and informative using Rich library.**
- Use Rich Tables for all task displays.
- Color coding MUST be consistent:
  - Pending tasks: Yellow/Amber indicators
  - Completed tasks: Green indicators
  - Headers: Bold cyan
  - IDs: Magenta
  - Timestamps: Dim white
- Display tasks in THREE categorized sections: [All Tasks], [Pending], [Completed].
- Empty states MUST show friendly messages, not blank tables.

**Rationale**: Visual hierarchy improves usability and makes the CLI tool professional and pleasant to use.

### V. Modular Code Architecture
**Code MUST be organized into logical, testable modules.**
- `models.py`: Task data schema and validation
- `storage.py`: JSON persistence operations (load/save)
- `commands.py`: CLI command implementations
- `ui.py`: Rich UI rendering and formatting
- `app.py`: Entry point and command routing

**Rationale**: Separation of concerns enables testing, maintenance, and future extensibility.

### VI. Command Completeness
**All required commands MUST be implemented with proper error handling.**

Commands:
- `add`: Create task with title and description (captures timestamp automatically)
- `list`: Display categorized view of all tasks
- `update <id>`: Modify task title, description, or status
- `delete <id>`: Remove specific task (ID stability maintained)
- `done <id>`: Mark task as completed
- `clear`: Delete all tasks and reset ID counter to 1

Error Handling:
- Invalid IDs MUST show clear error messages
- Missing arguments MUST prompt user with usage examples
- File I/O errors MUST be caught and reported

**Rationale**: Complete command coverage with robust error handling provides professional user experience.

## Phase-1 Technical Requirements

### Technology Stack
- **Python Version**: 3.13+ (leveraging latest features)
- **Package Manager**: UV (already initialized)
- **UI Library**: `rich` (for tables, colors, formatting)
- **Storage**: JSON file (`tasks.json`)
- **Standard Library**: `json`, `datetime`, `argparse` or `typer`

### Task Schema
```python
{
    "id": int,              # Unique, sequential, stable
    "title": str,           # Task title (required)
    "description": str,     # Task description (required)
    "status": str,          # "Pending" or "Completed"
    "created_at": str       # "YYYY-MM-DD HH:MM:SS"
}
```

### Project Structure
```
console-app/
├── pyproject.toml          # UV project configuration
├── tasks.json              # Persistent data storage
├── src/
│   ├── models.py           # Task model
│   ├── storage.py          # JSON operations
│   ├── commands.py         # Command implementations
│   ├── ui.py               # Rich UI components
│   └── app.py              # CLI entry point
└── tests/                  # Unit tests (future)
```

## Development Workflow

### Implementation Sequence
1. ✅ **Setup**: UV initialization (already completed)
2. **Core Module**: Implement `models.py` with Task class
3. **Storage Layer**: Implement `storage.py` with load/save operations
4. **UI Layer**: Implement `ui.py` with Rich table rendering
5. **Commands**: Implement each command in `commands.py`
6. **Integration**: Wire everything in `app.py`
7. **Testing**: Manual testing of all commands and edge cases

### Quality Gates
- All commands MUST work as specified
- Data persistence MUST be verified across app restarts
- ID stability MUST be tested with delete operations
- Clear command MUST properly reset state
- Rich UI MUST render correctly with color and formatting

### Testing Checklist
- [ ] Add task and verify it appears in list
- [ ] Restart app and verify task persists
- [ ] Complete task and verify status change
- [ ] Delete task and verify ID stability
- [ ] Update task and verify changes persist
- [ ] Clear all tasks and verify ID counter resets
- [ ] Test error cases (invalid ID, missing args)

---

## Phase-2: Full-Stack Web Application

This section governs the transition from CLI to a modern web application with user authentication and multi-user support.

## Phase-2 Core Principles

### VII. Authentication & Security
**All API endpoints MUST be protected with JWT-based authentication.**
- Next.js (frontend) issues JWT tokens using Better Auth
- FastAPI (backend) validates JWT tokens from `Authorization: Bearer <token>` header
- Shared `BETTER_AUTH_SECRET` between frontend and backend
- Every request to backend API MUST include valid JWT
- Invalid or expired tokens MUST return 401 Unauthorized

**Rationale**: Ensures secure multi-user access and prevents unauthorized data access.

### VIII. Data Isolation & Multi-Tenancy
**Users MUST ONLY access their own data.**
- Every task MUST be linked to a `user_id` field
- API endpoints MUST follow pattern: `/api/{user_id}/tasks`
- Backend MUST validate: `JWT user_id` == `URL param user_id` on every request
- User A cannot access, view, modify, or delete User B's tasks
- Cross-user data access MUST return 403 Forbidden

**Rationale**: Enforces strict data ownership and prevents data leaks between users.

### IX. Modern Full-Stack Architecture
**Application MUST use modern, production-ready technologies.**
- **Frontend**: Next.js 16+ with App Router, Better Auth, Tailwind CSS
- **Backend**: Python FastAPI with SQLModel ORM
- **Database**: Neon Serverless PostgreSQL
- **API Design**: RESTful endpoints with proper status codes
- **Error Handling**: Structured error responses with proper HTTP codes

**Rationale**: Provides scalable, maintainable foundation for production application.

### X. User Experience Standards
**Web UI MUST be modern, responsive, and intuitive.**
- Tailwind CSS for styling with mobile-first responsive design
- Dashboard shows tasks with status indicators (Complete/Pending)
- Tasks display timestamps (created_at, completed_at if applicable)
- Login/Signup pages using Better Auth
- Real-time task state updates (add, complete, delete, update)
- Empty states with friendly messages

**Rationale**: Professional user experience matching modern web standards.

## Phase-2 Technical Requirements

### Technology Stack

#### Frontend
- **Framework**: Next.js 16+ (App Router architecture)
- **Authentication**: Better Auth (JWT token management)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **HTTP Client**: Native fetch or Axios

#### Backend
- **Framework**: Python FastAPI
- **ORM**: SQLModel (built on Pydantic + SQLAlchemy)
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Custom JWT validation middleware
- **API Documentation**: Auto-generated via FastAPI OpenAPI

#### Shared Infrastructure
- **Secret Management**: Environment variables for `BETTER_AUTH_SECRET`
- **Database Migrations**: Alembic (SQLModel integration)
- **Environment**: Separate `.env` for development/staging/production

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tasks Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending' or 'Completed'
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

### API Endpoints

#### Authentication (Frontend-managed via Better Auth)
- `POST /auth/signin` - Login and receive JWT
- `POST /auth/signup` - Register new user and receive JWT
- `POST /auth/signout` - Logout (invalidate token)

#### Task Management (Backend FastAPI)
All endpoints require `Authorization: Bearer <jwt_token>` header and user_id in URL:

- `GET /api/{user_id}/tasks` - List all tasks for user
  - Query params: `status` (optional filter: 'Pending'|'Completed'|'All')
  - Response: 200 with array of tasks, 401 unauthorized, 403 forbidden

- `POST /api/{user_id}/tasks` - Create new task
  - Body: `{ "title": str, "description": str (optional) }`
  - Response: 201 with created task, 401/403/422 (validation error)

- `PUT /api/{user_id}/tasks/{task_id}` - Update task
  - Body: `{ "title"?: str, "description"?: str, "status"?: str }`
  - Response: 200 with updated task, 401/403/404/422

- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
  - Response: 204 No Content, 401/403/404

- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Mark task as completed
  - Response: 200 with updated task, 401/403/404

### Authentication Flow

#### Token Issuance (Frontend)
1. User signs in/up via Better Auth on Next.js
2. Better Auth validates credentials against backend (or internal auth store)
3. Better Auth generates JWT using `BETTER_AUTH_SECRET`
4. JWT stored in secure cookie or localStorage
5. JWT sent in `Authorization: Bearer <token>` header for API calls

#### Token Validation (Backend)
```python
# FastAPI dependency
async def verify_jwt(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    try:
        payload = decode_jwt(token, BETTER_AUTH_SECRET)
        user_id = payload.get("sub")  # Subject = user_id
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Data Isolation Implementation

#### Endpoint Validation Pattern
```python
@app.get("/api/{user_id}/tasks")
async def get_tasks(
    user_id: UUID,
    token_user_id: UUID = Depends(verify_jwt)
):
    # CRITICAL: Verify token user matches URL user
    if token_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Safe to proceed - user can only access their own tasks
    tasks = await session.exec(
        select(Task).where(Task.user_id == user_id)
    )
    return tasks
```

### Project Structure

```
/
├── frontend/                   # Next.js application
│   ├── app/
│   │   ├── (auth)/            # Login/Signup pages
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── dashboard/         # Protected dashboard
│   │   │   └── page.tsx
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   └── AuthGuard.tsx
│   ├── lib/
│   │   └── api.ts             # API client with auth headers
│   └── package.json
│
├── backend/                   # FastAPI application
│   ├── alembic/               # Database migrations
│   ├── alembic.ini
│   ├── src/
│   │   ├── models/
│   │   │   ├── user.py        # User model (SQLModel)
│   │   │   └── task.py        # Task model (SQLModel)
│   │   ├── api/
│   │   │   └── routes.py      # API endpoints
│   │   ├── auth/
│   │   │   └── jwt.py         # JWT validation
│   │   ├── database.py        # Database connection
│   │   └── main.py            # FastAPI app entry point
│   ├── tests/
│   └── pyproject.toml
│
└── .env.example               # Environment variables template
```

## Phase-2 Development Workflow

### Implementation Sequence
1. ✅ **Backend Setup**: Initialize FastAPI project with SQLModel
2. **Database**: Setup Neon PostgreSQL and create schema
3. **Authentication**: Implement JWT validation middleware in FastAPI
4. **Backend API**: Implement task endpoints with user isolation
5. **Frontend Setup**: Initialize Next.js 16+ with App Router
6. **Frontend Auth**: Setup Better Auth for authentication
7. **Frontend UI**: Build dashboard with Tailwind CSS
8. **Integration**: Connect frontend to backend API with auth
9. **Testing**: E2E testing of complete user flows

### Quality Gates
- JWT validation works for all protected endpoints
- User isolation is enforced on every API call
- Frontend properly stores and sends JWT tokens
- Dashboard shows tasks for authenticated user only
- UI is responsive and works on mobile devices
- Error handling shows user-friendly messages

### Testing Checklist
#### Backend
- [ ] JWT validation rejects invalid/expired tokens
- [ ] Endpoint returns 403 when token user_id != URL user_id
- [ ] User A cannot access User B's tasks
- [ ] All CRUD operations work for valid user
- [ ] Database migrations execute successfully

#### Frontend
- [ ] Login works and JWT is stored
- [ ] Dashboard loads only authenticated user's tasks
- [ ] Task add/edit/delete operations reflect immediately
- [ ] Logout clears JWT and redirects to signin
- [ ] Responsive design works on mobile/desktop

#### Integration
- [ ] Complete user journey: signup → create tasks → complete tasks → logout
- [ ] Multiple users cannot see each other's tasks
- [ ] Session timeout handles gracefully

## Governance

### Constitution Authority
This constitution is the authoritative source for Phase-1 and Phase-2 development decisions. All implementation choices MUST align with these principles.

### Amendment Process
- **MAJOR version bump**: Breaking changes to principles (e.g., changing authentication mechanism)
- **MINOR version bump**: Adding new principles or expanding sections (e.g., Phase-3 requirements)
- **PATCH version bump**: Clarifications, typos, non-semantic fixes

### Future Phases
This constitution will be extended (not replaced) when adding:
- Phase-3: Real-time collaboration (WebSockets)
- Phase-4: Advanced features (tags, categories, due dates)
- Phase-5: Mobile applications (React Native / Flutter)

Each phase will add new sections while preserving Phase-1 and Phase-2 principles.

### Compliance
- Every code change MUST comply with these principles
- The developer MUST verify compliance before committing
- User prompts that conflict with these principles MUST be clarified
- Phase-1 and Phase-2 principles are both active and must be maintained

**Version**: 2.0.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2026-01-01
