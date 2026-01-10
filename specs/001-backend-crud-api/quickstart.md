# Quickstart Guide: Backend CRUD API

**Purpose**: Get the backend API running locally for development and testing
**Created**: 2026-01-01

## Prerequisites

- Python 3.13 or higher installed
- `uv` package manager installed
- Neon PostgreSQL account and database connection string
- Git repository cloned locally

## Setup Steps

### 1. Create Backend Directory Structure

```bash
mkdir -p backend/src/{models,api,database} backend/tests backend/alembic/versions
```

### 2. Initialize Python Project

```bash
cd backend
uv init
```

### 3. Install Dependencies

```bash
# Add FastAPI and database dependencies
uv add fastapi uvicorn[standard] sqlmodel psycopg2-binary alembic python-jose[cryptography] pydantic pydantic-settings

# Add testing dependencies
uv add --dev pytest pytest-asyncio httpx httpx-asyncio
```

### 4. Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
# Database Connection
DATABASE_URL=postgresql://user:password@ep-cool-neon-host.neon.tech/todo_db?sslmode=require

# JWT Secret (must match frontend)
BETTER_AUTH_SECRET=your-super-secret-key-change-in-production

# Application Settings
APP_NAME=Todo App API
DEBUG=True
```

### 5. Run Database Migrations

```bash
# Generate initial migration
alembic revision --autogenerate -m "Initial schema"

# Apply migration to database
alembic upgrade head
```

### 6. Start Development Server

```bash
# Run FastAPI with auto-reload for development
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### 7. Verify API Documentation

Open browser and navigate to:
- **API Docs**: http://localhost:8000/docs
- **OpenAPI Spec**: http://localhost:8000/openapi.json
- **ReDoc**: http://localhost:8000/redoc

### 8. Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_tasks_api.py -v
```

## Development Workflow

### Testing Endpoints

Use the API docs at `http://localhost:8000/docs` to test endpoints interactively, or use `curl`:

```bash
# Get auth token (replace with actual JWT generation)
export TOKEN="your-jwt-token-here"

# List all tasks
curl -X GET "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer $TOKEN"

# Create a task
curl -X POST "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn FastAPI","description":"Build CRUD API"}'

# Update a task
curl -X PUT "http://localhost:8000/api/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'

# Delete a task
curl -X DELETE "http://localhost:8000/api/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer $TOKEN"

# Mark task as complete
curl -X PATCH "http://localhost:8000/api/{user_id}/tasks/{task_id}/complete" \
  -H "Authorization: Bearer $TOKEN"
```

### Database Queries

Connect directly to Neon PostgreSQL to verify data:

```bash
# Using psql (requires Neon's connection string)
psql $DATABASE_URL

# Example queries
SELECT * FROM tasks WHERE user_id = 'your-uuid' ORDER BY created_at DESC;
SELECT COUNT(*) FROM tasks WHERE user_id = 'your-uuid' AND status = 'Pending';
```

## Common Issues & Solutions

### Database Connection Error

**Error**: `sqlalchemy.exc.OperationalError: could not connect`

**Solution**: Verify `DATABASE_URL` in `.env` file and Neon database is accessible.

### JWT Verification Error

**Error**: `401 Unauthorized` on valid token

**Solution**: Check `BETTER_AUTH_SECRET` matches between frontend and backend, and token is not expired.

### Module Import Error

**Error**: `ModuleNotFoundError: No module named 'sqlmodel'`

**Solution**: Ensure dependencies installed with `uv add sqlmodel`.

### Migration Error

**Error**: `Target database is not up to date`

**Solution**: Run `alembic upgrade head` to apply all pending migrations.

## Next Steps

After completing this quickstart:
1. Review [data-model.md](data-model.md) for entity definitions
2. Review [contracts/tasks-api.yaml](contracts/tasks-api.yaml) for API specifications
3. Follow implementation tasks in `tasks.md` (created via `/sp.tasks`)
4. Refer to constitution Phase-2 principles for authentication and data isolation requirements
