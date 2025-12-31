<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0
Changes: Initial constitution creation for Phase-1 (Console Todo App)
Modified Principles: All (initial creation)
Added Sections: Phase-1 Requirements, Development Workflow
Templates Status: ✅ Initial setup complete
Follow-up TODOs: Future phases will extend this constitution
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

## Governance

### Constitution Authority
This constitution is the authoritative source for Phase-1 development decisions. All implementation choices MUST align with these principles.

### Amendment Process
- **MAJOR version bump**: Breaking changes to principles (e.g., changing ID stability rules)
- **MINOR version bump**: Adding new principles or expanding sections (e.g., Phase-2 requirements)
- **PATCH version bump**: Clarifications, typos, non-semantic fixes

### Future Phases
This constitution will be extended (not replaced) when adding:
- Phase-2: Web interface
- Phase-3: Multi-user support
- Phase-4: Cloud sync

Each phase will add new sections while preserving Phase-1 principles.

### Compliance
- Every code change MUST comply with these principles
- The developer MUST verify compliance before committing
- User prompts that conflict with these principles MUST be clarified

**Version**: 1.0.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2025-12-31
