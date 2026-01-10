# Data Model: Backend CRUD API

**Purpose**: Define database schema and entity relationships for task management
**Created**: 2026-01-01
**Source**: [spec.md](spec.md) requirements

## Entities

### Task

**Purpose**: Represents a user's to-do item with complete lifecycle tracking

**Fields**:

| Field | Type | Constraints | Purpose |
|--------|--------|------------|---------|
| id | UUID | Primary key, auto-generated | Unique identifier for task |
| user_id | UUID | Foreign key to users table, NOT NULL | Owner reference for data isolation |
| title | VARCHAR(500) | Required, NOT NULL | Task title/description |
| description | TEXT | Optional, can be NULL | Detailed task information |
| status | VARCHAR(50) | Default 'Pending', values: 'Pending' or 'Completed' | Current task state |
| created_at | TIMESTAMP | NOT NULL, auto-set | When task was created |
| completed_at | TIMESTAMP | Optional, NULL when Pending | When task was completed |
| updated_at | TIMESTAMP | NOT NULL, auto-updated | Last modification time |

**Indexes**:
- `idx_tasks_user_id`: On `user_id` column for efficient user-specific queries
- `idx_tasks_status`: On `status` column for filtering by completion state

**Constraints**:
- `user_id` foreign key with `ON DELETE CASCADE` (user deletion removes all tasks)
- `status` check constraint: Must be 'Pending' or 'Completed'

### User

**Purpose**: Represents system user (managed by authentication system, referenced by tasks)

**Fields**:

| Field | Type | Constraints | Purpose |
|--------|--------|------------|---------|
| id | UUID | Primary key, auto-generated | Unique user identifier |
| email | VARCHAR(255) | Unique, NOT NULL | User email for login/identification |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password (never store plain text) |
| name | VARCHAR(255) | Optional | Display name for user profile |
| created_at | TIMESTAMP | NOT NULL, auto-set | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, auto-updated | Last profile update timestamp |

**Indexes**:
- `idx_users_email`: Unique constraint on `email` column

**Constraints**:
- `email` unique constraint prevents duplicate accounts
- `password_hash` required for authentication

## Relationships

### User-Tasks Relationship
- **Type**: One-to-Many
- **From**: `User.id`
- **To**: `Task.user_id`
- **Cascade**: `ON DELETE CASCADE` on `Task.user_id`
- **Business Rule**: A user can have zero or more tasks. Deleting a user removes all their tasks.

## State Transitions

### Task Status Flow

```
[Creation] → Pending
    ↓
[Mark Complete] → Completed
    ↓
[Mark Pending] → Pending (allow re-opening completed tasks)
```

**Rules**:
- New tasks default to 'Pending' status
- Status change from 'Pending' to 'Completed' sets `completed_at` timestamp
- Status change from 'Completed' to 'Pending' clears `completed_at` timestamp (allows re-opening tasks)
- Only valid transitions allowed: Pending ↔ Completed

## Validation Rules

### Task Validation

| Field | Rule | Error Response |
|--------|------|----------------|
| title | Required, max 500 characters | 422 Unprocessable Entity |
| description | Optional, no length limit | N/A |
| status | Must be 'Pending' or 'Completed' | 422 Unprocessable Entity |

### User Validation

| Field | Rule | Error Response |
|--------|------|----------------|
| email | Required, valid email format, unique | 422 Unprocessable Entity |
| password_hash | Required (during creation) | 422 Unprocessable Entity |

## Database Schema (DDL)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed')),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

## Notes

- UUID identifiers provide better security and scalability than sequential integers
- Timestamps in UTC for consistency across timezones
- Cascade delete ensures data consistency when users are removed
- Indexes optimize common query patterns (by user, by status)
