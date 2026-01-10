# Quickstart: Phase-2 Backend

**Feature**: 002-phase-2-backend | **Last Updated**: 2026-01-03

## Prerequisites

- Python 3.13+
- UV package manager (already initialized)
- PostgreSQL connection (Neon) - see `.env`

## Setup

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
uv pip install -e .
```

Or if using pip:

```bash
pip install -e .
```

### 3. Configure environment

The `.env` file is already configured with your Neon PostgreSQL connection:

```bash
# Check the environment file
cat .env
```

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret for JWT signing (add this)

### 4. Generate JWT secret

Generate a secure random secret for JWT:

```bash
# Using Python
python -c "import secrets; print(secrets.token_hex(32))"

# Add this to your .env file as:
# BETTER_AUTH_SECRET=your_generated_secret
```

### 5. Run database migrations

```bash
alembic upgrade head
```

### 6. Start the development server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **Base URL**: http://localhost:8000
- **OpenAPI Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## First Request Example

### Register a new user

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Create a task

```bash
curl -X POST http://localhost:8000/api/{user_id}/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {access_token}" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'
```

### List your tasks

```bash
curl http://localhost:8000/api/{user_id}/tasks?status=All \
  -H "Authorization: Bearer {access_token}"
```

## Project Structure

```
backend/
├── src/
│   ├── main.py           # FastAPI app entry point
│   ├── database.py       # SQLModel engine and session
│   ├── models/           # SQLModel table definitions
│   │   ├── user.py
│   │   ├── task.py
│   │   └── token.py
│   ├── schemas/          # Pydantic request/response models
│   │   ├── user.py
│   │   └── task.py
│   ├── api/              # API route handlers
│   │   ├── auth.py
│   │   └── tasks.py
│   ├── auth/             # Authentication utilities
│   │   ├── jwt.py
│   │   └── password.py
│   └── dependencies.py   # FastAPI dependencies
├── alembic/              # Database migrations
├── tests/                # Test suite
├── .env                  # Environment variables
└── pyproject.toml        # Project configuration
```

## Testing

### Run all tests

```bash
pytest tests/ -v
```

### Run with coverage

```bash
pytest --cov=src tests/
```

### Run specific test categories

```bash
# Authentication tests
pytest tests/test_auth.py -v

# Task CRUD tests
pytest tests/test_tasks.py -v

# Data isolation tests
pytest tests/test_isolation.py -v
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | JWT signing secret (32+ chars) |
| `JWT_EXPIRATION_HOURS` | No | Token expiration (default: 24) |
| `ALEMBIC_CONFIG` | No | Path to alembic.ini |

## Common Issues

### Database connection failed

Verify your `.env` file has the correct `DATABASE_URL`:
```bash
# Test connection
python -c "from sqlmodel import create_engine; e = create_engine('$DATABASE_URL'); e.connect()"
```

### Migration errors

Run migrations with verbose output:
```bash
alembic upgrade head --verbosity=2
```

### Import errors after adding new modules

Ensure Python path includes the backend directory:
```bash
PYTHONPATH=. uvicorn src.main:app --reload
```

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Implement models in `backend/src/models/`
3. Implement API endpoints in `backend/src/api/`
4. Write tests in `backend/tests/`
5. Verify with: `pytest tests/ -v`
