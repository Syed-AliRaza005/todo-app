# Research: Console Todo Application

**Feature**: 001-console-todo-app
**Date**: 2025-12-31
**Purpose**: Resolve technical decisions and clarify implementation approach

## Technology Stack Decisions

### Decision 1: CLI Framework

**Decision**: Use Python's built-in `argparse` module

**Rationale**:
- Native to Python standard library (no external dependency)
- Simple command structure matches our 6 commands perfectly
- Sufficient for single-level commands (add, list, update, delete, done, clear)
- Built-in help text generation
- Lightweight and fast startup time

**Alternatives Considered**:
- **Click**: Popular CLI framework but adds external dependency
  - Rejected: Overkill for simple command structure
- **Typer**: Modern CLI with type hints, built on Click
  - Rejected: Additional complexity unnecessary for straightforward commands
- **Fire**: Auto-generates CLI from functions
  - Rejected: Less control over command structure and help text

---

### Decision 2: Data Storage Format

**Decision**: JSON with human-readable formatting (indent=2)

**Rationale**:
- Constitution requires human-readable debugging (Principle I)
- Native Python `json` module support
- Simple structure: `{"tasks": [...], "next_id": int}`
- Easy to inspect and manually edit if needed
- No external database setup required
- Suitable for target scale (~50,000 tasks, <10MB)

**Alternatives Considered**:
- **SQLite**: Relational database
  - Rejected: Overkill for flat task list, adds complexity
- **CSV**: Simple text format
  - Rejected: Doesn't handle nested data well, no native ID counter
- **Pickle**: Python serialization
  - Rejected: Not human-readable, binary format violates constitution

**Storage Schema**:
```json
{
  "next_id": 1,
  "tasks": [
    {
      "id": 1,
      "title": "Task title",
      "description": "Task description",
      "status": "Pending",
      "created_at": "2025-12-31 14:30:45"
    }
  ]
}
```

---

### Decision 3: Rich Library Usage Patterns

**Decision**: Use Rich Tables with custom styling and Console for all output

**Rationale**:
- Constitution Principle IV requires Rich library with specific colors
- Tables provide structured display for categorized sections
- Console object enables consistent styling across application
- Supports empty state handling with custom messages

**Implementation Pattern**:
```python
from rich.console import Console
from rich.table import Table
from rich.style import Style

# Color scheme from constitution:
COLORS = {
    'pending': 'yellow',
    'completed': 'green',
    'header': 'bold cyan',
    'id': 'magenta',
    'timestamp': 'dim white'
}
```

**Best Practices**:
- Create reusable table builder function in `ui.py`
- Separate table generation from data logic
- Use Style objects for consistent color application
- Implement empty state checks before rendering tables

---

### Decision 4: Error Handling Strategy

**Decision**: Multi-layered error handling with contextual messages

**Rationale**:
- Constitution requires graceful error handling (FR-014, FR-015, FR-016, FR-017)
- Users need actionable feedback without technical jargon

**Error Categories**:
1. **Validation Errors** (Invalid ID, missing args):
   - Catch at command layer
   - Show usage examples with Rich formatting

2. **File I/O Errors** (Permission denied, disk full):
   - Catch in storage layer
   - Provide recovery suggestions
   - Fallback to empty state for corrupted JSON

3. **Data Corruption** (Invalid JSON):
   - Try to parse, log error
   - Backup corrupted file to `tasks.json.backup`
   - Initialize with empty state
   - Notify user of backup location

**Implementation**:
```python
# Custom exception hierarchy
class TodoError(Exception): pass
class TaskNotFoundError(TodoError): pass
class StorageError(TodoError): pass
class ValidationError(TodoError): pass
```

---

### Decision 5: Module Organization

**Decision**: Five-module architecture per constitution

**Rationale**:
- Constitution Principle V mandates specific modules
- Clear separation of concerns
- Each module has single responsibility

**Module Responsibilities**:

1. **models.py** (30-50 lines):
   - Task dataclass with validation
   - Status enum (Pending, Completed)
   - Timestamp formatting utilities

2. **storage.py** (80-120 lines):
   - load_tasks() → List[Task]
   - save_tasks(List[Task], next_id)
   - Error handling for file operations
   - JSON serialization/deserialization

3. **ui.py** (100-150 lines):
   - render_tasks_table(tasks, section_name)
   - render_error(message)
   - render_success(message)
   - Color constants and styling

4. **commands.py** (200-300 lines):
   - add_task(title, description)
   - list_tasks()
   - update_task(id, title, description)
   - delete_task(id)
   - mark_done(id)
   - clear_all()

5. **app.py** (50-80 lines):
   - Argument parser setup
   - Command routing
   - Entry point (main function)

**Estimated Total LOC**: ~500-700 lines

---

### Decision 6: ID Management Strategy

**Decision**: Separate counter stored in JSON root, never decremented

**Rationale**:
- Constitution Principle II requires stable IDs
- Counter must persist across restarts
- Deleting tasks doesn't affect counter
- Clear command resets counter to 1

**Implementation**:
```python
# Storage structure
{
  "next_id": 5,  # Always increments, only resets on clear
  "tasks": [
    {"id": 1, ...},  # ID never changes
    {"id": 3, ...},  # ID 2 was deleted, gap remains
    {"id": 4, ...}
  ]
}

# ID assignment logic
def add_task(title, desc):
    tasks, next_id = load_tasks()
    new_task = Task(id=next_id, ...)
    tasks.append(new_task)
    save_tasks(tasks, next_id + 1)  # Increment counter
```

---

### Decision 7: Timestamp Handling

**Decision**: Use datetime.now() with strftime at creation time

**Rationale**:
- Constitution Principle III requires YYYY-MM-DD HH:MM:SS format
- Timestamps immutable after creation
- System timezone acceptable (no conversion)

**Implementation**:
```python
from datetime import datetime

def create_timestamp() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# In Task creation:
Task(
    id=next_id,
    title=title,
    description=description,
    status="Pending",
    created_at=create_timestamp()  # Captured once
)
```

---

### Decision 8: Testing Strategy for Phase 1

**Decision**: Manual integration testing following constitution checklist

**Rationale**:
- Constitution provides testing checklist
- Unit tests deferred to future iteration
- Focus on end-to-end command validation

**Test Scenarios** (from constitution):
1. Add task → verify in list
2. Restart app → verify persistence
3. Mark done → verify status change
4. Delete task → verify ID stability
5. Update task → verify changes persist
6. Clear → verify reset
7. Error cases → verify messaging

**Test Execution**:
- Create test script: `test_manual.sh`
- Document results in `test_results.txt`
- Verify against each success criterion (SC-001 through SC-008)

---

## Performance Considerations

### File I/O Optimization

**Approach**: Immediate write-through with atomic file operations

**Rationale**:
- Constitution requires immediate saves after each change
- Atomic writes prevent corruption from interrupted operations
- Acceptable for target scale (<10MB files)

**Implementation**:
```python
import json
import os
from pathlib import Path

def save_tasks(tasks, next_id):
    data = {"next_id": next_id, "tasks": [t.to_dict() for t in tasks]}

    # Atomic write: write to temp, then rename
    temp_path = Path("tasks.json.tmp")
    final_path = Path("tasks.json")

    with temp_path.open('w') as f:
        json.dump(data, f, indent=2)

    temp_path.replace(final_path)  # Atomic on POSIX
```

---

## Risk Mitigation

### Risk 1: Concurrent Access

**Risk**: Two instances modify tasks.json simultaneously
**Likelihood**: Low (single-user assumption)
**Impact**: Data corruption
**Mitigation**: Document as known limitation in Phase-1, detect and warn on startup if file is locked (future enhancement)

### Risk 2: Large Data Files

**Risk**: Performance degrades with >50,000 tasks
**Likelihood**: Low (usage pattern)
**Impact**: Slow startup and save operations
**Mitigation**: Document scale limits in README, consider pagination in Phase-2

### Risk 3: Terminal Compatibility

**Risk**: Colors don't render on some terminals
**Likelihood**: Low (modern terminals)
**Impact**: Poor UX but functionality intact
**Mitigation**: Rich library auto-detects color support, falls back gracefully

---

## Open Questions

**None** - All technical decisions resolved. Ready for Phase 1 design.

---

## References

- Constitution: `.specify/memory/constitution.md`
- Feature Spec: `specs/001-console-todo-app/spec.md`
- Rich Library Docs: https://rich.readthedocs.io/
- Python argparse Docs: https://docs.python.org/3/library/argparse.html
