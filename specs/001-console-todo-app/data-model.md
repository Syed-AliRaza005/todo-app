# Data Model: Console Todo Application

**Feature**: 001-console-todo-app
**Date**: 2025-12-31
**Purpose**: Define data structures, validation rules, and state transitions

## Overview

The Console Todo Application uses a simple, flat data model with two primary entities:
1. **Task** - Individual todo items
2. **TaskCollection** - The persisted collection with ID counter

## Entity: Task

### Description
Represents a single todo item with immutable ID and timestamp, mutable title/description, and status tracking.

### Fields

| Field | Type | Required | Immutable | Validation | Default |
|-------|------|----------|-----------|------------|---------|
| `id` | int | Yes | Yes | Positive integer ≥ 1 | Auto-assigned from counter |
| `title` | str | Yes | No | 1-1000 chars, non-empty after strip | N/A |
| `description` | str | Yes | No | 0-1000 chars | N/A |
| `status` | str | Yes | No | Must be "Pending" or "Completed" | "Pending" |
| `created_at` | str | Yes | Yes | Format: YYYY-MM-DD HH:MM:SS | Auto-captured at creation |

### Validation Rules

#### Title Validation
```python
def validate_title(title: str) -> str:
    """
    Validates and normalizes task title.

    Rules:
    - Must not be empty after stripping whitespace
    - Length: 1-1000 characters after stripping
    - Leading/trailing whitespace is removed

    Raises:
        ValidationError: If title is empty or too long
    """
    cleaned = title.strip()
    if not cleaned:
        raise ValidationError("Title cannot be empty")
    if len(cleaned) > 1000:
        raise ValidationError("Title cannot exceed 1000 characters")
    return cleaned
```

#### Description Validation
```python
def validate_description(description: str) -> str:
    """
    Validates and normalizes task description.

    Rules:
    - Length: 0-1000 characters after stripping
    - Leading/trailing whitespace is removed
    - Empty descriptions are allowed

    Raises:
        ValidationError: If description is too long
    """
    cleaned = description.strip()
    if len(cleaned) > 1000:
        raise ValidationError("Description cannot exceed 1000 characters")
    return cleaned
```

#### Status Validation
```python
from enum import Enum

class TaskStatus(str, Enum):
    PENDING = "Pending"
    COMPLETED = "Completed"

def validate_status(status: str) -> TaskStatus:
    """
    Validates task status.

    Rules:
    - Must be exactly "Pending" or "Completed" (case-sensitive)

    Raises:
        ValidationError: If status is invalid
    """
    try:
        return TaskStatus(status)
    except ValueError:
        raise ValidationError(f"Status must be 'Pending' or 'Completed', got: {status}")
```

#### Timestamp Validation
```python
from datetime import datetime

TIMESTAMP_FORMAT = "%Y-%m-%d %H:%M:%S"

def validate_timestamp(timestamp: str) -> str:
    """
    Validates timestamp format.

    Rules:
    - Format: YYYY-MM-DD HH:MM:SS
    - Must be parseable as datetime
    - No timezone component

    Raises:
        ValidationError: If timestamp format is invalid
    """
    try:
        datetime.strptime(timestamp, TIMESTAMP_FORMAT)
        return timestamp
    except ValueError:
        raise ValidationError(f"Invalid timestamp format. Expected: YYYY-MM-DD HH:MM:SS")
```

### State Transitions

```
┌─────────┐
│ Pending │  ← Initial state on creation
└────┬────┘
     │
     │ done command (FR-003)
     ▼
┌───────────┐
│ Completed │  ← Terminal state (no transition out)
└───────────┘

Notes:
- Transitions via done command only
- No "uncomplete" operation (one-way transition)
- Update command preserves current status
- Delete removes task entirely (no status change)
```

### Python Representation

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import ClassVar

@dataclass
class Task:
    """
    Immutable task data structure.

    Attributes match JSON storage format for easy serialization.
    Validation occurs in factory method, not __init__.
    """
    id: int
    title: str
    description: str
    status: str
    created_at: str

    # Class constant
    TIMESTAMP_FORMAT: ClassVar[str] = "%Y-%m-%d %H:%M:%S"

    @classmethod
    def create(cls, id: int, title: str, description: str) -> 'Task':
        """
        Factory method for creating new tasks with validation.

        Args:
            id: Unique task identifier (from counter)
            title: Task title (will be validated and normalized)
            description: Task description (will be validated and normalized)

        Returns:
            Task instance with status="Pending" and current timestamp

        Raises:
            ValidationError: If validation fails
        """
        return cls(
            id=id,
            title=validate_title(title),
            description=validate_description(description),
            status=TaskStatus.PENDING.value,
            created_at=datetime.now().strftime(cls.TIMESTAMP_FORMAT)
        )

    def mark_completed(self) -> 'Task':
        """
        Creates a new Task instance with Completed status.

        Returns:
            New Task instance (immutable update pattern)
        """
        return Task(
            id=self.id,
            title=self.title,
            description=self.description,
            status=TaskStatus.COMPLETED.value,
            created_at=self.created_at
        )

    def update_details(self, title: str, description: str) -> 'Task':
        """
        Creates a new Task instance with updated title/description.

        Args:
            title: New title (will be validated)
            description: New description (will be validated)

        Returns:
            New Task instance with updated fields

        Raises:
            ValidationError: If validation fails
        """
        return Task(
            id=self.id,
            title=validate_title(title),
            description=validate_description(description),
            status=self.status,
            created_at=self.created_at
        )

    def to_dict(self) -> dict:
        """Serializes task to dictionary for JSON storage."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Task':
        """
        Deserializes task from dictionary (from JSON storage).

        Args:
            data: Dictionary with task fields

        Returns:
            Task instance

        Raises:
            ValidationError: If data is invalid
        """
        # Validate all fields
        validate_timestamp(data["created_at"])
        validate_status(data["status"])
        # Title/description validated if updated, but trust stored data
        return cls(
            id=data["id"],
            title=data["title"],
            description=data["description"],
            status=data["status"],
            created_at=data["created_at"]
        )
```

---

## Entity: TaskCollection

### Description
Root storage structure containing all tasks and the ID counter. Manages ID stability and persistence.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `next_id` | int | Yes | Counter for next task ID (never decrements except on clear) |
| `tasks` | List[Task] | Yes | All tasks (may have gaps in IDs) |

### Validation Rules

```python
def validate_next_id(next_id: int, tasks: List[Task]) -> int:
    """
    Validates next_id counter.

    Rules:
    - Must be positive integer ≥ 1
    - Must be greater than max task ID (if tasks exist)

    Raises:
        ValidationError: If next_id is invalid
    """
    if next_id < 1:
        raise ValidationError("next_id must be at least 1")

    if tasks:
        max_id = max(task.id for task in tasks)
        if next_id <= max_id:
            raise ValidationError(f"next_id ({next_id}) must be greater than max task ID ({max_id})")

    return next_id
```

### Invariants

1. **ID Uniqueness**: No two tasks can have the same ID
   ```python
   assert len(tasks) == len(set(task.id for task in tasks))
   ```

2. **ID Counter Monotonicity**: next_id always increases (except clear)
   ```python
   # After add operation:
   assert new_next_id == old_next_id + 1
   ```

3. **ID Stability**: Deleting tasks never changes next_id
   ```python
   # After delete operation:
   assert new_next_id == old_next_id
   ```

### Python Representation

```python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class TaskCollection:
    """
    Manages task collection and ID counter.

    Ensures ID stability and validates invariants.
    """
    next_id: int
    tasks: List[Task]

    def __post_init__(self):
        """Validates invariants after initialization."""
        validate_next_id(self.next_id, self.tasks)

        # Check ID uniqueness
        ids = [task.id for task in self.tasks]
        if len(ids) != len(set(ids)):
            raise ValidationError("Duplicate task IDs detected")

    def add_task(self, title: str, description: str) -> 'TaskCollection':
        """
        Creates new collection with added task.

        Args:
            title: Task title
            description: Task description

        Returns:
            New TaskCollection with incremented next_id
        """
        new_task = Task.create(self.next_id, title, description)
        return TaskCollection(
            next_id=self.next_id + 1,
            tasks=self.tasks + [new_task]
        )

    def get_task(self, task_id: int) -> Optional[Task]:
        """Finds task by ID or returns None."""
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def update_task(self, task_id: int, title: str, description: str) -> 'TaskCollection':
        """
        Creates new collection with updated task.

        Raises:
            TaskNotFoundError: If task_id doesn't exist
        """
        updated_tasks = []
        found = False

        for task in self.tasks:
            if task.id == task_id:
                updated_tasks.append(task.update_details(title, description))
                found = True
            else:
                updated_tasks.append(task)

        if not found:
            raise TaskNotFoundError(f"Task with ID {task_id} not found")

        return TaskCollection(next_id=self.next_id, tasks=updated_tasks)

    def mark_done(self, task_id: int) -> 'TaskCollection':
        """
        Creates new collection with task marked as completed.

        Raises:
            TaskNotFoundError: If task_id doesn't exist
        """
        updated_tasks = []
        found = False

        for task in self.tasks:
            if task.id == task_id:
                updated_tasks.append(task.mark_completed())
                found = True
            else:
                updated_tasks.append(task)

        if not found:
            raise TaskNotFoundError(f"Task with ID {task_id} not found")

        return TaskCollection(next_id=self.next_id, tasks=updated_tasks)

    def delete_task(self, task_id: int) -> 'TaskCollection':
        """
        Creates new collection without specified task.
        Note: next_id is NOT decremented (ID stability).

        Raises:
            TaskNotFoundError: If task_id doesn't exist
        """
        new_tasks = [task for task in self.tasks if task.id != task_id]

        if len(new_tasks) == len(self.tasks):
            raise TaskNotFoundError(f"Task with ID {task_id} not found")

        return TaskCollection(next_id=self.next_id, tasks=new_tasks)

    @staticmethod
    def clear() -> 'TaskCollection':
        """Creates new empty collection with next_id reset to 1."""
        return TaskCollection(next_id=1, tasks=[])

    def to_dict(self) -> dict:
        """Serializes collection to dictionary for JSON storage."""
        return {
            "next_id": self.next_id,
            "tasks": [task.to_dict() for task in self.tasks]
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'TaskCollection':
        """
        Deserializes collection from dictionary.

        Handles missing fields and validates structure.
        """
        next_id = data.get("next_id", 1)
        task_dicts = data.get("tasks", [])
        tasks = [Task.from_dict(td) for td in task_dicts]
        return cls(next_id=next_id, tasks=tasks)
```

---

## Storage Format

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["next_id", "tasks"],
  "properties": {
    "next_id": {
      "type": "integer",
      "minimum": 1,
      "description": "Counter for next task ID"
    },
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "title", "description", "status", "created_at"],
        "properties": {
          "id": {
            "type": "integer",
            "minimum": 1
          },
          "title": {
            "type": "string",
            "minLength": 1,
            "maxLength": 1000
          },
          "description": {
            "type": "string",
            "maxLength": 1000
          },
          "status": {
            "type": "string",
            "enum": ["Pending", "Completed"]
          },
          "created_at": {
            "type": "string",
            "pattern": "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$"
          }
        }
      }
    }
  }
}
```

### Example Storage File

```json
{
  "next_id": 5,
  "tasks": [
    {
      "id": 1,
      "title": "Implement models.py",
      "description": "Create Task and TaskCollection classes",
      "status": "Completed",
      "created_at": "2025-12-31 10:00:00"
    },
    {
      "id": 3,
      "title": "Write storage.py",
      "description": "Implement load and save functions",
      "status": "Pending",
      "created_at": "2025-12-31 10:15:00"
    },
    {
      "id": 4,
      "title": "Build UI components",
      "description": "Create Rich table rendering functions",
      "status": "Pending",
      "created_at": "2025-12-31 10:20:00"
    }
  ]
}
```

**Note**: Task ID 2 is missing (was deleted), demonstrating ID stability principle.

---

## Data Access Patterns

### Read Operations
- **Load all tasks**: O(n) - deserialize JSON, create Task objects
- **Find by ID**: O(n) - linear search through task list
- **Filter by status**: O(n) - iterate and filter

### Write Operations
- **Add task**: O(n) - append to list, serialize to JSON
- **Update task**: O(n) - find and replace, serialize to JSON
- **Delete task**: O(n) - filter list, serialize to JSON
- **Mark done**: O(n) - find and replace, serialize to JSON
- **Clear all**: O(1) - create new empty collection, serialize

**Performance Note**: All operations acceptable for target scale (<50,000 tasks). No indexing needed for Phase-1.

---

## Error Handling

### Custom Exceptions

```python
class TodoError(Exception):
    """Base exception for all todo app errors."""
    pass

class ValidationError(TodoError):
    """Raised when data validation fails."""
    pass

class TaskNotFoundError(TodoError):
    """Raised when task ID doesn't exist."""
    pass

class StorageError(TodoError):
    """Raised when file I/O operations fail."""
    pass
```

### Error Recovery Strategies

| Error Type | Recovery Strategy |
|------------|-------------------|
| Corrupted JSON | Backup to .backup file, initialize empty state |
| Missing file | Initialize with empty TaskCollection |
| Permission denied | Report error, suggest checking permissions |
| Disk full | Report error, cannot save |
| Invalid task data | Skip invalid task, log warning |

---

## Migration Strategy

**Phase-1**: No migrations needed (initial version)

**Future Phases**: If schema changes required:
1. Add version field to JSON root
2. Implement migration functions
3. Detect old version on load
4. Auto-migrate and save with new version

---

## References

- Feature Spec: `specs/001-console-todo-app/spec.md`
- Constitution: `.specify/memory/constitution.md`
- Research: `specs/001-console-todo-app/research.md`
