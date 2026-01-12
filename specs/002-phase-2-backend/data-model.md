# Data Model: Phase-2 Full-Stack Web Application Backend

**Feature**: 002-phase-2-backend | **Date**: 2026-01-03

## Overview

This document defines the database entities, relationships, and validation rules for the Phase-2 backend.

---

## Entity Definitions

### User

Represents a registered user in the system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Default: `gen_random_uuid()` | Unique user identifier |
| `email` | VARCHAR(255) | Unique, Not Null | User's email address |
| `password_hash` | VARCHAR(255) | Not Null | Bcrypt hash of user's password |
| `name` | VARCHAR(255) | - | User's display name (optional) |
| `created_at` | TIMESTAMP | Default: `NOW()` | Account creation timestamp |
| `updated_at` | TIMESTAMP | Default: `NOW()` | Last modification timestamp |

**Relationships**:
- One-to-Many with Task (user can have many tasks)
- ON DELETE CASCADE: Deleting user removes all their tasks

**SQL Definition**:
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

---

### Task

Represents a user's todo item.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Default: `gen_random_uuid()` | Unique task identifier |
| `user_id` | UUID | Foreign Key (users.id), Not Null | Owning user reference |
| `title` | VARCHAR(500) | Not Null | Task title (max 500 characters) |
| `description` | TEXT | - | Task description (optional) |
| `status` | VARCHAR(50) | Default: 'Pending' | Task status: 'Pending' or 'Completed' |
| `created_at` | TIMESTAMP | Default: `NOW()` | Task creation timestamp |
| `completed_at` | TIMESTAMP | - | When task was completed (nullable) |
| `updated_at` | TIMESTAMP | Default: `NOW()` | Last modification timestamp |

**Relationships**:
- Many-to-One with User (each task belongs to one user)

**SQL Definition**:
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

---

### RevokedToken

Stores JWT tokens that have been revoked (logged out).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `token_jti` | VARCHAR(255) | Primary Key | JWT ID (unique per token) |
| `user_id` | UUID | Foreign Key (users.id), Not Null | User who logged out |
| `expires_at` | TIMESTAMP | Not Null | When the token expires |

**Purpose**: Enables server-side token revocation for logout functionality

**SQL Definition**:
```sql
CREATE TABLE revoked_tokens (
    token_jti VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_revoked_tokens_expires ON revoked_tokens(expires_at);
```

---

## SQLModel Implementation

### backend/src/models/user.py

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
import uuid

class User(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        nullable=False
    )
    email: str = Field(unique=True, max_length=255, nullable=False)
    password_hash: str = Field(max_length=255, nullable=False)
    name: Optional[str] = Field(max_length=255, default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship
    tasks: list["Task"] = Relationship(back_populates="user", cascade_delete="all")
```

### backend/src/models/task.py

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
import uuid

class Task(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        nullable=False
    )
    user_id: uuid.UUID = Field(
        foreign_key="user.id", on_delete="CASCADE",
        nullable=False
    )
    title: str = Field(max_length=500, nullable=False)
    description: Optional[str] = Field(default=None)
    status: str = Field(default="Pending", max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    completed_at: Optional[datetime] = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship
    user: "User" = Relationship(back_populates="tasks")
```

### backend/src/models/token.py

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class RevokedToken(SQLModel, table=True):
    token_jti: str = Field(primary_key=True, max_length=255)
    user_id: uuid.UUID = Field(
        foreign_key="user.id", on_delete="CASCADE",
        nullable=False
    )
    expires_at: datetime = Field(nullable=False)
```

---

## Validation Rules

### User Validation (Pydantic Schemas)

| Rule | Description | Error Code |
|------|-------------|------------|
| Email format | Must be valid email format | 422 |
| Email unique | No duplicate emails | 400 |
| Password length | Minimum 8 characters | 422 |
| Name length | Maximum 255 characters | 422 |

### Task Validation (Pydantic Schemas)

| Rule | Description | Error Code |
|------|-------------|------------|
| Title required | Title cannot be empty | 422 |
| Title length | Maximum 500 characters | 422 |
| Status value | Must be 'Pending' or 'Completed' | 422 |
| Description optional | Can be null/empty | N/A |

---

## Status Transitions

### Task Status Flow

```
Pending <---> Completed
   ^            |
   |            v
   +------------+
   (can go either direction)
```

**Rules**:
- New tasks start with status "Pending"
- Transition to "Completed" sets `completed_at` timestamp
- Transition back to "Pending" clears `completed_at`
- Status updates trigger `updated_at` timestamp change

---

## Indexes and Performance

### Primary Indexes (Automatic)

- `users.id` - Primary key index
- `tasks.id` - Primary key index
- `revoked_tokens.token_jti` - Primary key index

### Secondary Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| `users` | `idx_users_email` | Fast lookup during login |
| `tasks` | `idx_tasks_user_id` | Fast task retrieval per user |
| `tasks` | `idx_tasks_status` | Filter tasks by status |
| `revoked_tokens` | `idx_revoked_tokens_expires` | Cleanup expired tokens |

---

## Data Isolation Rules

### User-Task Relationship

1. Every task MUST have a non-null `user_id`
2. `user_id` MUST reference a valid `users.id`
3. Deleting a user CASCADEs to delete all their tasks
4. No orphaned tasks allowed

### API-Level Enforcement

```python
# Before any task operation:
if task.user_id != current_user.id:
    raise HTTPException(status_code=403, detail="Access denied")
```

---

## Migration Strategy (Alembic)

### Initial Migration

1. Create `users` table
2. Create `tasks` table with foreign key
3. Create `revoked_tokens` table
4. Create indexes

### Future Migrations

- Use `alembic revision --autogenerate` for schema changes
- Test migrations on staging before production
- Never modify existing migrations, create new ones
