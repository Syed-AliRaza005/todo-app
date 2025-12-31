# Quickstart Guide: Console Todo Application

**Feature**: 001-console-todo-app
**Date**: 2025-12-31
**Audience**: Developers implementing this feature

## Overview

This quickstart provides step-by-step implementation guidance for the Console Todo Application, following the constitution's modular architecture and implementation sequence.

## Prerequisites

- Python 3.13+ installed
- UV package manager initialized (already completed)
- Terminal with color support
- Read/write permissions in project directory

## Implementation Sequence

Follow this exact order per Constitution Development Workflow:

1. ✅ Setup (completed)
2. → Core Module (`models.py`)
3. → Storage Layer (`storage.py`)
4. → UI Layer (`ui.py`)
5. → Commands (`commands.py`)
6. → Integration (`app.py`)
7. → Testing

---

## Step 1: Core Module (models.py)

### File Location
`console-app/src/models.py`

### Implementation Checklist

- [ ] Create `Task` dataclass with all fields (id, title, description, status, created_at)
- [ ] Implement `Task.create()` factory method
- [ ] Implement `Task.mark_completed()` method
- [ ] Implement `Task.update_details()` method
- [ ] Implement `Task.to_dict()` and `Task.from_dict()` serialization
- [ ] Create `TaskStatus` enum (Pending, Completed)
- [ ] Create `TaskCollection` dataclass (next_id, tasks)
- [ ] Implement `TaskCollection` methods: add, get, update, mark_done, delete, clear
- [ ] Create custom exceptions: `TodoError`, `ValidationError`, `TaskNotFoundError`, `StorageError`
- [ ] Add validation functions: validate_title, validate_description, validate_status, validate_timestamp

### Verification Commands
```bash
# Create simple test script
cd console-app
python -c "
from src.models import Task, TaskCollection
task = Task.create(1, 'Test', 'Description')
print(f'Created task: {task.id} - {task.title}')
print(f'Status: {task.status}')
collection = TaskCollection(next_id=1, tasks=[])
collection = collection.add_task('New task', 'Test description')
print(f'Collection has {len(collection.tasks)} task(s)')
"
```

**Expected Output:**
```
Created task: 1 - Test
Status: Pending
Collection has 1 task(s)
```

### Key Points from Data Model
- Use `@dataclass` decorator for Task and TaskCollection
- Task fields: `id: int`, `title: str`, `description: str`, `status: str`, `created_at: str`
- Immutable pattern: Methods return new instances, don't modify in place
- Timestamp format: `"%Y-%m-%d %H:%M:%S"`

---

## Step 2: Storage Layer (storage.py)

### File Location
`console-app/src/storage.py`

### Implementation Checklist

- [ ] Create `STORAGE_FILE` constant: `Path("tasks.json")`
- [ ] Implement `load_collection() -> TaskCollection`
  - Handle missing file → return empty collection
  - Handle corrupted JSON → backup to `.backup`, return empty
  - Parse JSON and call `TaskCollection.from_dict()`
- [ ] Implement `save_collection(collection: TaskCollection) -> None`
  - Serialize with `collection.to_dict()`
  - Use atomic write pattern (write to .tmp, then rename)
  - Format with `json.dump(data, f, indent=2)`
- [ ] Add error handling for permission denied, disk full

### Verification Commands
```bash
cd console-app
python -c "
from src.models import TaskCollection
from src.storage import load_collection, save_collection
collection = TaskCollection(next_id=1, tasks=[])
collection = collection.add_task('Test task', 'Test description')
save_collection(collection)
print('Saved collection')
loaded = load_collection()
print(f'Loaded {len(loaded.tasks)} task(s)')
print(f'Next ID: {loaded.next_id}')
"

# Verify file was created
cat tasks.json
```

**Expected Output:**
```
Saved collection
Loaded 1 task(s)
Next ID: 2
```

**Expected tasks.json content:**
```json
{
  "next_id": 2,
  "tasks": [
    {
      "id": 1,
      "title": "Test task",
      "description": "Test description",
      "status": "Pending",
      "created_at": "2025-12-31 14:30:45"
    }
  ]
}
```

### Key Points from Research
- Use atomic writes: `temp_path.replace(final_path)`
- Handle FileNotFoundError → return empty collection
- Handle JSONDecodeError → backup file, return empty
- Use `Path` from `pathlib` for file operations

---

## Step 3: UI Layer (ui.py)

### File Location
`console-app/src/ui.py`

### Implementation Checklist

- [ ] Import `Console`, `Table` from `rich`
- [ ] Create `console = Console()` instance
- [ ] Define color constants matching constitution:
  ```python
  COLORS = {
      'pending': 'yellow',
      'completed': 'green',
      'header': 'bold cyan',
      'id': 'magenta',
      'timestamp': 'dim white',
      'success': 'green',
      'error': 'red'
  }
  ```
- [ ] Implement `render_tasks_table(tasks: List[Task], title: str) -> None`
  - Create Rich Table with double-edge box
  - Add columns: ID (magenta), Title, Description, Status (colored), Created (dim white)
  - Apply colors based on task status
  - Handle empty list → show friendly message
- [ ] Implement `render_all_tasks(collection: TaskCollection) -> None`
  - Call render_tasks_table three times: All, Pending, Completed
- [ ] Implement `render_success(message: str) -> None`
  - Use console.print with green color
- [ ] Implement `render_error(message: str) -> None`
  - Use console.print with red color, stderr=True
- [ ] Implement `render_task_detail(task: Task) -> None`
  - Show single task in formatted view

### Verification Commands
```bash
cd console-app
python -c "
from src.models import Task, TaskCollection
from src.ui import render_all_tasks, render_success
collection = TaskCollection(next_id=3, tasks=[
    Task(1, 'Task 1', 'Description 1', 'Completed', '2025-12-31 10:00:00'),
    Task(2, 'Task 2', 'Description 2', 'Pending', '2025-12-31 10:15:00')
])
render_all_tasks(collection)
render_success('Test successful!')
"
```

**Expected Output:**
- Three color-coded tables
- Pending task in yellow
- Completed task in green
- Success message in green

### Key Points from Constitution
- Headers: Bold cyan
- IDs: Magenta
- Timestamps: Dim white
- Pending status: Yellow/amber
- Completed status: Green
- Empty states: Friendly messages, not blank tables

---

## Step 4: Commands (commands.py)

### File Location
`console-app/src/commands.py`

### Implementation Checklist

- [ ] Import models, storage, ui modules
- [ ] Implement `cmd_add(title: str, description: str) -> None`
  - Load collection
  - Add task via `collection.add_task()`
  - Save collection
  - Render success with task details
  - Handle ValidationError, StorageError
- [ ] Implement `cmd_list() -> None`
  - Load collection
  - Render via `ui.render_all_tasks()`
  - Handle StorageError
- [ ] Implement `cmd_done(task_id: int) -> None`
  - Load collection
  - Mark done via `collection.mark_done()`
  - Save collection
  - Render success
  - Handle TaskNotFoundError, StorageError
- [ ] Implement `cmd_update(task_id: int, title: str, description: str) -> None`
  - Load collection
  - Update via `collection.update_task()`
  - Save collection
  - Render success
  - Handle TaskNotFoundError, ValidationError, StorageError
- [ ] Implement `cmd_delete(task_id: int) -> None`
  - Load collection
  - Delete via `collection.delete_task()`
  - Save collection
  - Render success
  - Handle TaskNotFoundError, StorageError
- [ ] Implement `cmd_clear() -> None`
  - Create new empty collection via `TaskCollection.clear()`
  - Save collection
  - Render success
  - Handle StorageError

### Verification Commands
```bash
cd console-app
# Test each command in isolation
python -c "
from src.commands import cmd_add, cmd_list, cmd_done
cmd_add('Test task 1', 'First test')
cmd_add('Test task 2', 'Second test')
cmd_list()
cmd_done(1)
cmd_list()
"
```

**Expected Output:**
- Success messages for add operations
- Table showing both tasks
- Success message for done operation
- Updated table showing task 1 as completed

### Key Points from CLI Contract
- All commands load collection first
- All write commands save collection after modification
- All errors are caught and rendered via `ui.render_error()`
- Exit codes: 0 (success), 1 (user error), 2 (system error)

---

## Step 5: Integration (app.py)

### File Location
`console-app/src/app.py`

### Implementation Checklist

- [ ] Import `argparse` and `sys`
- [ ] Import command functions from `commands.py`
- [ ] Create `create_parser() -> ArgumentParser`
  - Set description: "Console Todo Application"
  - Add subparsers for each command
  - Configure arguments per CLI contract
- [ ] Add subcommand: `add`
  - Arguments: `title`, `description`
- [ ] Add subcommand: `list`
  - No arguments
- [ ] Add subcommand: `done`
  - Arguments: `id` (type=int)
- [ ] Add subcommand: `update`
  - Arguments: `id` (type=int), `title`, `description`
- [ ] Add subcommand: `delete`
  - Arguments: `id` (type=int)
- [ ] Add subcommand: `clear`
  - No arguments
- [ ] Implement `main()` function
  - Parse arguments
  - Route to appropriate command function
  - Handle exceptions and set exit codes
- [ ] Add `if __name__ == "__main__": main()` guard

### Verification Commands
```bash
cd console-app
# Test help
python src/app.py --help

# Test each command
python src/app.py add "Task 1" "Description 1"
python src/app.py list
python src/app.py done 1
python src/app.py update 1 "Updated" "New description"
python src/app.py delete 1
python src/app.py clear
```

**Expected Output:**
- Help text showing all commands
- Success messages for each operation
- Proper error messages for invalid inputs

### Key Points
- Use `argparse.ArgumentParser` with subparsers
- Each subcommand calls corresponding function in `commands.py`
- Main function wraps everything in try-except for clean error handling
- Set `sys.exit(0)` for success, `sys.exit(1)` for user errors, `sys.exit(2)` for system errors

---

## Step 6: Testing

### Manual Test Script

Create `console-app/test_manual.sh`:
```bash
#!/bin/bash
set -e

echo "=== Manual Test Suite ==="
echo

echo "Test 1: Add tasks"
python src/app.py add "Task 1" "First task"
python src/app.py add "Task 2" "Second task"
python src/app.py add "Task 3" "Third task"
echo "✓ Added 3 tasks"
echo

echo "Test 2: List tasks"
python src/app.py list
echo "✓ Listed tasks"
echo

echo "Test 3: Mark task as done"
python src/app.py done 1
python src/app.py list
echo "✓ Task 1 marked as completed"
echo

echo "Test 4: Update task"
python src/app.py update 2 "Updated Task 2" "Updated description"
python src/app.py list
echo "✓ Task 2 updated"
echo

echo "Test 5: Delete task"
python src/app.py delete 2
python src/app.py list
echo "✓ Task 2 deleted (IDs 1 and 3 remain)"
echo

echo "Test 6: Add new task (should get ID 4)"
python src/app.py add "Task 4" "Fourth task"
python src/app.py list
echo "✓ Task 4 added with ID 4 (ID stability verified)"
echo

echo "Test 7: Clear all tasks"
python src/app.py clear
python src/app.py list
echo "✓ All tasks cleared"
echo

echo "Test 8: Add task after clear (should get ID 1)"
python src/app.py add "New Task" "After clear"
python src/app.py list
echo "✓ New task has ID 1 (counter reset verified)"
echo

echo "=== All Tests Passed ==="
```

Run with:
```bash
chmod +x test_manual.sh
./test_manual.sh
```

### Constitution Checklist Verification

From `.specify/memory/constitution.md`:
- [ ] Add task and verify it appears in list
- [ ] Restart app and verify task persists
- [ ] Complete task and verify status change
- [ ] Delete task and verify ID stability
- [ ] Update task and verify changes persist
- [ ] Clear all tasks and verify ID counter resets
- [ ] Test error cases (invalid ID, missing args)

### Success Criteria Verification

From spec.md:
- [ ] SC-001: Task creation completes in < 10 seconds
- [ ] SC-002: Data persists across restarts (100% accuracy)
- [ ] SC-003: ID stability maintained after deletions
- [ ] SC-004: Clear command resets counter to 1
- [ ] SC-005: Visual distinction between pending/completed
- [ ] SC-006: Commands respond in < 1 second
- [ ] SC-007: Error messages are descriptive
- [ ] SC-008: Corrupted data handled gracefully

---

## Project Structure (Final)

```
console-app/
├── pyproject.toml           # UV project config (already exists)
├── tasks.json               # Created by app on first run
├── src/
│   ├── __init__.py          # Empty file for package
│   ├── models.py            # ~150 lines
│   ├── storage.py           # ~100 lines
│   ├── ui.py                # ~120 lines
│   ├── commands.py          # ~250 lines
│   └── app.py               # ~80 lines
├── test_manual.sh           # Test script
└── README.md                # User-facing documentation (optional)
```

**Total estimated LOC**: ~700 lines

---

## Common Issues and Solutions

### Issue: ModuleNotFoundError for 'src'
**Solution**: Run from `console-app/` directory or add to PYTHONPATH:
```bash
export PYTHONPATH=/mnt/g/Todo-app/console-app:$PYTHONPATH
```

### Issue: Rich tables not rendering correctly
**Solution**: Verify terminal supports colors:
```bash
python -c "from rich import print; print('[bold cyan]Test[/]')"
```

### Issue: Permission denied writing tasks.json
**Solution**: Check directory permissions:
```bash
ls -la console-app/
chmod u+w console-app/
```

### Issue: Corrupted tasks.json
**Solution**: App should auto-backup and create new file. Manually restore:
```bash
mv tasks.json.backup tasks.json
```

---

## Dependencies

Install Rich library:
```bash
cd console-app
uv add rich
```

Verify installation:
```bash
python -c "import rich; print(rich.__version__)"
```

---

## Next Steps After Implementation

1. Complete manual testing checklist
2. Verify all success criteria
3. Document any deviations from plan
4. Create user-facing README.md
5. Run `/sp.tasks` command to generate tasks.md (optional)
6. Ready for `/sp.git.commit_pr` to commit changes

---

## References

- Constitution: `/mnt/g/Todo-app/.specify/memory/constitution.md`
- Feature Spec: `/mnt/g/Todo-app/specs/001-console-todo-app/spec.md`
- Data Model: `/mnt/g/Todo-app/specs/001-console-todo-app/data-model.md`
- CLI Contract: `/mnt/g/Todo-app/specs/001-console-todo-app/contracts/cli-interface.md`
- Research: `/mnt/g/Todo-app/specs/001-console-todo-app/research.md`
