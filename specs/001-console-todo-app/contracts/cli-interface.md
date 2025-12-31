# CLI Interface Contract: Console Todo Application

**Feature**: 001-console-todo-app
**Date**: 2025-12-31
**Purpose**: Define command-line interface contract for all commands

## Overview

This document specifies the exact CLI interface including command syntax, arguments, exit codes, and output formats. Adheres to FR-001 through FR-006 from the feature specification.

## Global Conventions

### Exit Codes
- `0`: Success
- `1`: User error (invalid arguments, task not found)
- `2`: System error (file I/O failure, corruption)

### Output Formatting
- Success messages: Green text via Rich
- Error messages: Red text via Rich, written to stderr
- Tables: Rich Table with constitution-specified colors
- Empty states: Friendly messages, not blank output

### Common Errors
```text
Error: Task with ID {id} not found
Error: {field} cannot be empty
Error: {field} cannot exceed {max} characters
Error: Invalid command. Use --help for usage information
```

---

## Command: add

### Purpose
Create a new task with title and description, auto-assigning ID and timestamp.

### Syntax
```bash
python app.py add <title> <description>
```

### Arguments

| Argument | Type | Required | Validation |
|----------|------|----------|------------|
| `title` | string | Yes | 1-1000 chars after strip |
| `description` | string | Yes | 0-1000 chars after strip |

### Behavior
1. Load current TaskCollection from storage
2. Validate title and description
3. Create Task with next available ID
4. Assign current timestamp in YYYY-MM-DD HH:MM:SS format
5. Set status to "Pending"
6. Increment next_id counter
7. Save TaskCollection to storage
8. Display success message with assigned ID

### Success Output
```text
✓ Task added successfully!

  ID: 5
  Title: Implement add command
  Description: Create functionality to add new tasks
  Status: Pending
  Created: 2025-12-31 14:30:45
```

### Error Cases

| Error | Exit Code | Message |
|-------|-----------|---------|
| Missing title | 1 | `Error: Missing required argument: <title>. Usage: add <title> <description>` |
| Missing description | 1 | `Error: Missing required argument: <description>. Usage: add <title> <description>` |
| Title empty | 1 | `Error: Title cannot be empty` |
| Title too long | 1 | `Error: Title cannot exceed 1000 characters` |
| Description too long | 1 | `Error: Description cannot exceed 1000 characters` |
| Storage failure | 2 | `Error: Failed to save task. {specific error}` |

### Examples
```bash
# Valid usage
$ python app.py add "Fix bug in parser" "Parser fails on empty input"
✓ Task added successfully!
  ID: 1
  ...

# Error: missing argument
$ python app.py add "Fix bug"
Error: Missing required argument: <description>. Usage: add <title> <description>

# Error: empty title
$ python app.py add "   " "Some description"
Error: Title cannot be empty
```

---

## Command: list

### Purpose
Display all tasks in three categorized sections: All Tasks, Pending, and Completed.

### Syntax
```bash
python app.py list
```

### Arguments
None

### Behavior
1. Load TaskCollection from storage
2. Render three Rich Tables:
   - **[All Tasks]**: All tasks sorted by ID ascending
   - **[Pending]**: Tasks with status="Pending", sorted by ID
   - **[Completed]**: Tasks with status="Completed", sorted by ID
3. Apply color coding per constitution:
   - Pending: Yellow/amber indicators
   - Completed: Green indicators
   - Headers: Bold cyan
   - IDs: Magenta
   - Timestamps: Dim white

### Success Output

**When tasks exist:**
```text
╔════════════════════════════════════════════════════════════╗
║                       All Tasks                             ║
╠═════╤═══════════╤══════════════╤═══════════╤══════════════╣
║  ID │  Title    │ Description  │  Status   │   Created    ║
╠═════╪═══════════╪══════════════╪═══════════╪══════════════╣
║  1  │ Task 1    │ Desc 1       │ Completed │ 2025-12-31.. ║
║  2  │ Task 2    │ Desc 2       │ Pending   │ 2025-12-31.. ║
╚═════╧═══════════╧══════════════╧═══════════╧══════════════╝

╔════════════════════════════════════════════════════════════╗
║                      Pending Tasks                          ║
╠═════╤═══════════╤══════════════╤═══════════╤══════════════╣
║  ID │  Title    │ Description  │  Status   │   Created    ║
╠═════╪═══════════╪══════════════╪═══════════╪══════════════╣
║  2  │ Task 2    │ Desc 2       │ Pending   │ 2025-12-31.. ║
╚═════╧═══════════╧══════════════╧═══════════╧══════════════╝

╔════════════════════════════════════════════════════════════╗
║                    Completed Tasks                          ║
╠═════╤═══════════╤══════════════╤═══════════╤══════════════╣
║  ID │  Title    │ Description  │  Status   │   Created    ║
╠═════╪═══════════╪══════════════╪═══════════╪══════════════╣
║  1  │ Task 1    │ Desc 1       │ Completed │ 2025-12-31.. ║
╚═════╧═══════════╧══════════════╧═══════════╧══════════════╝
```

**When no tasks exist:**
```text
📋 No tasks yet! Add your first task with: add <title> <description>
```

### Error Cases

| Error | Exit Code | Message |
|-------|-----------|---------|
| Storage read failure | 2 | `Error: Failed to load tasks. {specific error}` |
| Corrupted data | 2 | `Warning: Data file corrupted. Backed up to tasks.json.backup. Starting with empty list.` |

### Examples
```bash
# List with tasks
$ python app.py list
[Tables displayed as above]

# List with no tasks
$ python app.py list
📋 No tasks yet! Add your first task with: add <title> <description>
```

---

## Command: done

### Purpose
Mark a task as completed by changing its status to "Completed".

### Syntax
```bash
python app.py done <id>
```

### Arguments

| Argument | Type | Required | Validation |
|----------|------|----------|------------|
| `id` | integer | Yes | Must exist in task list |

### Behavior
1. Load TaskCollection from storage
2. Validate ID is an integer
3. Find task with matching ID
4. Update task status to "Completed"
5. Save TaskCollection to storage
6. Display success message

### Success Output
```text
✓ Task #5 marked as completed!

  ID: 5
  Title: Implement add command
  Status: Completed
```

### Error Cases

| Error | Exit Code | Message |
|-------|-----------|---------|
| Missing ID | 1 | `Error: Missing required argument: <id>. Usage: done <id>` |
| Invalid ID format | 1 | `Error: ID must be a positive integer` |
| Task not found | 1 | `Error: Task with ID {id} not found` |
| Storage failure | 2 | `Error: Failed to save task. {specific error}` |

### Examples
```bash
# Valid usage
$ python app.py done 5
✓ Task #5 marked as completed!

# Error: missing ID
$ python app.py done
Error: Missing required argument: <id>. Usage: done <id>

# Error: invalid ID
$ python app.py done abc
Error: ID must be a positive integer

# Error: task not found
$ python app.py done 999
Error: Task with ID 999 not found
```

---

## Command: update

### Purpose
Modify task title and/or description while preserving ID, status, and timestamp.

### Syntax
```bash
python app.py update <id> <title> <description>
```

### Arguments

| Argument | Type | Required | Validation |
|----------|------|----------|------------|
| `id` | integer | Yes | Must exist in task list |
| `title` | string | Yes | 1-1000 chars after strip |
| `description` | string | Yes | 0-1000 chars after strip |

### Behavior
1. Load TaskCollection from storage
2. Validate ID is an integer
3. Find task with matching ID
4. Validate new title and description
5. Update task with new values (preserve ID, status, created_at)
6. Save TaskCollection to storage
7. Display success message

### Success Output
```text
✓ Task #3 updated successfully!

  ID: 3
  Title: Fixed bug in parser (updated)
  Description: Parser now handles empty input correctly (updated)
  Status: Pending (unchanged)
  Created: 2025-12-31 10:00:00 (unchanged)
```

### Error Cases

| Error | Exit Code | Message |
|-------|-----------|---------|
| Missing ID | 1 | `Error: Missing required argument: <id>. Usage: update <id> <title> <description>` |
| Missing title | 1 | `Error: Missing required argument: <title>. Usage: update <id> <title> <description>` |
| Missing description | 1 | `Error: Missing required argument: <description>. Usage: update <id> <title> <description>` |
| Invalid ID format | 1 | `Error: ID must be a positive integer` |
| Task not found | 1 | `Error: Task with ID {id} not found` |
| Title empty | 1 | `Error: Title cannot be empty` |
| Title too long | 1 | `Error: Title cannot exceed 1000 characters` |
| Description too long | 1 | `Error: Description cannot exceed 1000 characters` |
| Storage failure | 2 | `Error: Failed to save task. {specific error}` |

### Examples
```bash
# Valid usage
$ python app.py update 3 "New title" "New description"
✓ Task #3 updated successfully!

# Error: missing arguments
$ python app.py update 3 "New title"
Error: Missing required argument: <description>. Usage: update <id> <title> <description>

# Error: task not found
$ python app.py update 999 "Title" "Description"
Error: Task with ID 999 not found
```

---

## Command: delete

### Purpose
Remove a task from the list without affecting other task IDs or the next_id counter.

### Syntax
```bash
python app.py delete <id>
```

### Arguments

| Argument | Type | Required | Validation |
|----------|------|----------|------------|
| `id` | integer | Yes | Must exist in task list |

### Behavior
1. Load TaskCollection from storage
2. Validate ID is an integer
3. Find task with matching ID
4. Remove task from collection (do NOT decrement next_id)
5. Save TaskCollection to storage
6. Display success message with deleted task info

### Success Output
```text
✓ Task #3 deleted successfully!

  Deleted: "Fix bug in parser"
  Note: Other task IDs remain unchanged
```

### Error Cases

| Error | Exit Code | Message |
|-------|-----------|---------|
| Missing ID | 1 | `Error: Missing required argument: <id>. Usage: delete <id>` |
| Invalid ID format | 1 | `Error: ID must be a positive integer` |
| Task not found | 1 | `Error: Task with ID {id} not found` |
| Storage failure | 2 | `Error: Failed to save task. {specific error}` |

### Examples
```bash
# Valid usage
$ python app.py delete 3
✓ Task #3 deleted successfully!
  Deleted: "Fix bug in parser"

# Error: task not found
$ python app.py delete 999
Error: Task with ID 999 not found
```

---

## Command: clear

### Purpose
Delete all tasks and reset the ID counter to 1.

### Syntax
```bash
python app.py clear
```

### Arguments
None

### Behavior
1. Create new empty TaskCollection with next_id=1
2. Save to storage (overwrites existing file)
3. Display confirmation message

### Success Output
```text
✓ All tasks cleared!

  Deleted: 5 task(s)
  ID counter reset to 1
```

### Error Cases

| Error | Exit Code | Message |
|-------|-----------|---------|
| Storage failure | 2 | `Error: Failed to clear tasks. {specific error}` |

### Examples
```bash
# Valid usage
$ python app.py clear
✓ All tasks cleared!
  Deleted: 5 task(s)
  ID counter reset to 1
```

---

## Help Interface

### Global Help
```bash
$ python app.py --help
```

**Output:**
```text
Console Todo Application

Usage:
  python app.py <command> [arguments]

Commands:
  add <title> <description>    Create a new task
  list                          Display all tasks
  done <id>                     Mark task as completed
  update <id> <title> <desc>    Update task details
  delete <id>                   Remove a task
  clear                         Delete all tasks

Examples:
  python app.py add "Buy milk" "Get 2% milk from store"
  python app.py list
  python app.py done 5
  python app.py update 3 "Buy milk" "Get whole milk instead"
  python app.py delete 3
  python app.py clear

For more information, see: README.md
```

### Command-Specific Help
```bash
$ python app.py add --help
```

**Output:**
```text
Add Command

Usage:
  python app.py add <title> <description>

Arguments:
  title        Task title (1-1000 characters, required)
  description  Task description (0-1000 characters, required)

Behavior:
  Creates a new task with auto-assigned ID and timestamp.
  Status is set to "Pending" by default.

Example:
  python app.py add "Implement feature" "Add user authentication"
```

---

## Input Handling

### Argument Parsing
- Use Python `argparse` module
- Subcommands for each operation
- Positional arguments (no flags for simplicity)
- Built-in help generation

### Special Characters
- Titles/descriptions with spaces: Use quotes
  ```bash
  python app.py add "Task with spaces" "Description with spaces"
  ```
- Quotes in text: Escape with backslash
  ```bash
  python app.py add "Say \"hello\"" "Greeting task"
  ```

### Input Sanitization
- Strip leading/trailing whitespace from all string inputs
- No HTML/SQL injection concerns (file-based storage, no web interface)

---

## Output Formatting

### Table Rendering (via Rich)

**Column Configuration:**
| Column | Width | Alignment | Style |
|--------|-------|-----------|-------|
| ID | Auto (min 5) | Center | Magenta |
| Title | Max 30 chars | Left | Default |
| Description | Max 40 chars | Left | Default |
| Status | Auto (min 10) | Center | Yellow (Pending), Green (Completed) |
| Created | Auto (19 chars) | Center | Dim white |

**Table Features:**
- Box border style: `box.DOUBLE_EDGE`
- Header style: Bold cyan
- Row separators: Yes
- Text wrapping: Title and Description wrap if exceed max width

---

## Error Message Format

### Standard Error Template
```text
Error: {error_message}

{optional_details}

{optional_suggestion}
```

### Examples
```text
Error: Task with ID 999 not found

Available task IDs: 1, 3, 5, 7
Use 'list' command to see all tasks.
```

---

## Performance Requirements

Derived from Success Criteria (SC-001, SC-006):
- Command response time: < 1 second for all operations
- Add command: Complete in < 10 seconds (including user input time)
- List command: Handle up to 50,000 tasks without noticeable delay

---

## References

- Feature Spec: `specs/001-console-todo-app/spec.md`
- Data Model: `specs/001-console-todo-app/data-model.md`
- Constitution: `.specify/memory/constitution.md`
- Rich Library Docs: https://rich.readthedocs.io/
- Python argparse: https://docs.python.org/3/library/argparse.html
