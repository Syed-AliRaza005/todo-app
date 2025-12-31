# Implementation Plan: Console Todo Application

**Branch**: `001-console-todo-app` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-console-todo-app/spec.md`

## Summary

Build a Python CLI todo application with persistent JSON storage, Rich library UI, and stable task ID management. The application provides six commands (add, list, done, update, delete, clear) with automatic timestamp capture, color-coded status display, and data persistence across restarts.

**Technical Approach**: Use Python's standard library (argparse, json, datetime) with Rich for UI. Modular architecture with five modules (models, storage, ui, commands, app) ensures separation of concerns and testability. JSON file storage with atomic writes provides persistence without external database dependencies.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: Rich library (for colored terminal UI)
**Storage**: JSON file (tasks.json) with human-readable formatting
**Testing**: Manual integration testing following constitution checklist (unit tests deferred)
**Target Platform**: Linux/macOS/Windows terminals with UTF-8 and color support
**Project Type**: Single CLI application
**Performance Goals**: <1s command response time, <10s task creation, handle ~50,000 tasks
**Constraints**: <10MB JSON file size, single-user access, immediate writes after each operation
**Scale/Scope**: ~700 lines of code, 6 commands, 2 entities (Task, TaskCollection)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Data Persistence & Integrity ✅
- **Requirement**: All tasks must be saved to tasks.json immediately after modifications
- **Implementation**: Atomic write-through in storage.py with temp file pattern
- **Compliance**: PASS - Every command function calls save_collection() after modification

### Principle II: ID Stability & Counter Management ✅
- **Requirement**: Task IDs never change except on clear; delete doesn't affect other IDs
- **Implementation**: Separate next_id counter in JSON root, only increments or resets
- **Compliance**: PASS - TaskCollection.delete_task() removes task but preserves next_id

### Principle III: Timestamp Accuracy ✅
- **Requirement**: Auto-capture timestamp at creation in YYYY-MM-DD HH:MM:SS format
- **Implementation**: Task.create() factory method calls datetime.now().strftime()
- **Compliance**: PASS - Timestamps immutable after creation, captured once

### Principle IV: Rich User Interface ✅
- **Requirement**: Rich Tables with specific color coding and three categorized sections
- **Implementation**: ui.py module with render_tasks_table() and color constants
- **Compliance**: PASS - All colors match constitution specs, three sections rendered

### Principle V: Modular Code Architecture ✅
- **Requirement**: Five specific modules (models, storage, ui, commands, app)
- **Implementation**: Exactly five modules with prescribed responsibilities
- **Compliance**: PASS - Each module has single responsibility per constitution

### Principle VI: Command Completeness ✅
- **Requirement**: All six commands with proper error handling
- **Implementation**: commands.py with error handling for each command
- **Compliance**: PASS - All FR-001 through FR-017 covered

### Quality Gates Summary
**All constitution principles satisfied. No violations to justify.**

## Project Structure

### Documentation (this feature)

```text
specs/001-console-todo-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technology decisions)
├── data-model.md        # Phase 1 output (entity design)
├── quickstart.md        # Phase 1 output (implementation guide)
├── contracts/
│   └── cli-interface.md # Phase 1 output (command contracts)
└── spec.md              # Feature specification (input)
```

### Source Code (console-app directory)

```text
console-app/
├── pyproject.toml          # UV project configuration (already exists)
├── tasks.json              # Persistent data storage (created at runtime)
├── src/
│   ├── __init__.py         # Python package marker
│   ├── models.py           # Task and TaskCollection classes (~150 lines)
│   ├── storage.py          # JSON load/save operations (~100 lines)
│   ├── ui.py               # Rich table rendering (~120 lines)
│   ├── commands.py         # Command implementations (~250 lines)
│   └── app.py              # CLI entry point with argparse (~80 lines)
└── test_manual.sh          # Manual test script (created in testing phase)
```

**Structure Decision**: Single CLI application structure selected. No backend/frontend split needed as this is a local command-line tool. The src/ directory contains all application code organized by responsibility. No tests/ directory in Phase-1; manual testing will be performed instead.

**Rationale**: Constitution mandates specific module names and responsibilities. Single-project structure is appropriate for standalone CLI tool with no web/mobile components.

## Complexity Tracking

> **No violations detected - this section is empty per constitution compliance**

All design choices align with constitution principles. No additional complexity or deviations to justify.

## Phase 0: Research (Completed)

**Output**: [research.md](./research.md)

**Key Decisions**:
1. **CLI Framework**: Python argparse (native, lightweight)
2. **Storage Format**: JSON with indent=2 (human-readable per constitution)
3. **Rich Library Patterns**: Tables with custom styling, color constants
4. **Error Handling**: Multi-layered with custom exception hierarchy
5. **Module Organization**: Five modules per constitution
6. **ID Management**: Separate counter in JSON, never decrements
7. **Timestamp Handling**: datetime.now() with strftime at creation
8. **Testing Strategy**: Manual integration testing (unit tests deferred)

**All NEEDS CLARIFICATION items resolved.**

## Phase 1: Design (Completed)

**Outputs**:
- [data-model.md](./data-model.md) - Entity design, validation rules, state transitions
- [contracts/cli-interface.md](./contracts/cli-interface.md) - Command interface specifications
- [quickstart.md](./quickstart.md) - Implementation guide

**Data Model Summary**:
- **Task**: id, title, description, status, created_at (immutable pattern)
- **TaskCollection**: next_id, tasks[] (manages ID stability)
- **Validation**: Title/description length, status enum, timestamp format
- **State Transitions**: Pending → Completed (one-way, no reverse)

**CLI Interface Summary**:
- **6 Commands**: add, list, done, update, delete, clear
- **Exit Codes**: 0 (success), 1 (user error), 2 (system error)
- **Output**: Rich Tables with color coding, success/error messages
- **Error Handling**: Descriptive messages with usage examples

**Agent Context**: Updated via update-agent-context.sh

## Phase 2: Implementation Plan

### Module Implementation Order

Follow this sequence per constitution and quickstart:

#### 1. models.py (~150 lines)
**Purpose**: Core data structures and validation

**Key Components**:
- `Task` dataclass with factory methods
- `TaskCollection` dataclass with CRUD operations
- `TaskStatus` enum (Pending, Completed)
- Custom exceptions (TodoError, ValidationError, TaskNotFoundError, StorageError)
- Validation functions (validate_title, validate_description, validate_status, validate_timestamp)

**Acceptance Criteria**:
- Task.create() generates valid task with timestamp
- TaskCollection.add_task() increments next_id correctly
- TaskCollection.delete_task() preserves next_id (ID stability)
- TaskCollection.clear() resets next_id to 1
- All validation functions raise appropriate errors

---

#### 2. storage.py (~100 lines)
**Purpose**: JSON persistence with error handling

**Key Components**:
- `STORAGE_FILE = Path("tasks.json")`
- `load_collection() -> TaskCollection`
- `save_collection(collection: TaskCollection) -> None`
- Atomic write pattern (write to .tmp, rename)
- Error handling (missing file, corrupted JSON, permission denied)

**Acceptance Criteria**:
- load_collection() returns empty collection for missing file
- load_collection() backs up corrupted file and returns empty collection
- save_collection() uses atomic writes (no partial updates)
- JSON formatted with indent=2 for readability
- File I/O errors raise StorageError with descriptive messages

---

#### 3. ui.py (~120 lines)
**Purpose**: Rich library rendering

**Key Components**:
- Color constants matching constitution
- `render_tasks_table(tasks, title)` - Single table renderer
- `render_all_tasks(collection)` - Three categorized sections
- `render_success(message)` - Green success messages
- `render_error(message)` - Red error messages to stderr
- `render_task_detail(task)` - Single task formatted view

**Acceptance Criteria**:
- Tables use double-edge box style
- Colors match constitution: pending=yellow, completed=green, headers=bold cyan, ids=magenta, timestamps=dim white
- Empty lists show friendly messages, not blank tables
- All output uses Rich Console for consistent styling

---

#### 4. commands.py (~250 lines)
**Purpose**: Command implementations with error handling

**Key Components**:
- `cmd_add(title, description)`
- `cmd_list()`
- `cmd_done(task_id)`
- `cmd_update(task_id, title, description)`
- `cmd_delete(task_id)`
- `cmd_clear()`

**Pattern** (all commands follow):
```python
def cmd_example():
    try:
        collection = load_collection()
        # ... perform operation ...
        save_collection(collection)
        render_success(...)
    except TodoError as e:
        render_error(str(e))
        sys.exit(1)
    except Exception as e:
        render_error(f"Unexpected error: {e}")
        sys.exit(2)
```

**Acceptance Criteria**:
- All commands load collection first
- Write commands save collection after modification
- All errors caught and rendered via ui.render_error()
- Exit codes: 0 (success), 1 (user error), 2 (system error)
- Success messages display relevant task details

---

#### 5. app.py (~80 lines)
**Purpose**: CLI entry point and argument parsing

**Key Components**:
- `create_parser()` - Configures argparse with subcommands
- `main()` - Routes to command functions
- Subcommands: add, list, done, update, delete, clear
- Help text generation

**Acceptance Criteria**:
- `--help` displays usage information
- Each command has proper arguments per CLI contract
- main() catches exceptions and sets exit codes
- Invalid commands show helpful error messages

---

### Implementation Verification

After completing each module, run verification command from quickstart.md to ensure correctness before proceeding.

**Final Integration Test**: Run test_manual.sh script covering all constitution checklist items.

---

## Testing Strategy

### Manual Testing (Phase-1)

**Test Script**: `console-app/test_manual.sh`

**Test Cases** (from constitution):
1. Add task and verify in list
2. Restart app and verify persistence
3. Mark task done and verify status change
4. Delete task and verify ID stability
5. Update task and verify changes persist
6. Clear all and verify ID counter reset to 1
7. Test error cases (invalid ID, missing args, corrupted file)

**Success Criteria Validation** (from spec):
- SC-001: Task creation < 10 seconds
- SC-002: 100% data persistence across restarts
- SC-003: ID stability maintained
- SC-004: Clear command resets counter
- SC-005: Visual distinction between statuses
- SC-006: Commands respond < 1 second
- SC-007: Descriptive error messages
- SC-008: Graceful corruption handling

### Unit Testing (Deferred to Future Iteration)

Unit tests will be added in a future phase using pytest. For now, focus on integration testing to validate end-to-end functionality.

---

## Dependencies

### Required
- **Rich**: Terminal UI library
  ```bash
  cd console-app
  uv add rich
  ```

### Standard Library (No Installation Required)
- `argparse`: CLI argument parsing
- `json`: JSON serialization
- `datetime`: Timestamp generation
- `pathlib`: File path handling
- `dataclasses`: Data structure creation
- `enum`: Status enumeration
- `sys`: Exit code management

---

## Risk Mitigation

### Identified Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Concurrent file access | Low | High (data corruption) | Document as known limitation; consider file locking in Phase-2 |
| Large file performance | Low | Medium (slow load/save) | Document 50k task limit; consider pagination in Phase-2 |
| Terminal incompatibility | Low | Low (degraded UX) | Rich auto-detects color support and falls back gracefully |
| Corrupted JSON | Medium | Medium (data loss) | Auto-backup to .backup file, initialize empty state |
| Permission errors | Low | Medium (cannot save) | Clear error messages with suggestions |

---

## Success Metrics

### Functional Completeness
- ✅ All 6 commands implemented
- ✅ All 17 functional requirements (FR-001 through FR-017) satisfied
- ✅ All 6 user stories with acceptance criteria met

### Quality Gates
- ✅ Constitution compliance (all 6 principles)
- ✅ Data persistence verified across restarts
- ✅ ID stability tested with deletions
- ✅ Color coding matches specifications
- ✅ Error handling covers all edge cases

### Performance
- Command response < 1 second (SC-006)
- Task creation < 10 seconds (SC-001)
- Handles ~50,000 tasks (scale target)

---

## Next Steps

1. **Implementation**: Follow quickstart.md module-by-module
2. **Testing**: Run test_manual.sh and verify all checklist items
3. **Documentation**: Create user-facing README.md (optional)
4. **Task Breakdown**: Run `/sp.tasks` to generate detailed tasks.md (optional)
5. **Commit**: Run `/sp.git.commit_pr` to commit and create pull request

---

## Architectural Decisions

### AD-1: Use argparse over Click/Typer
**Rationale**: Native Python library, zero external dependencies for CLI parsing, sufficient for simple command structure

**Trade-offs**:
- ✅ No dependency management overhead
- ✅ Familiar to Python developers
- ❌ Less elegant API than Typer
- ❌ No automatic type validation

**Decision**: Benefits outweigh drawbacks for this use case

---

### AD-2: JSON over SQLite
**Rationale**: Constitution requires human-readable storage, simpler for single-user CLI

**Trade-offs**:
- ✅ Human-readable and debuggable
- ✅ No database setup
- ✅ Easy backup/restore (copy file)
- ❌ O(n) operations (acceptable at target scale)
- ❌ No concurrent access support

**Decision**: JSON aligns with constitution and scale requirements

---

### AD-3: Immutable Data Pattern
**Rationale**: Easier to reason about, prevents accidental mutations, supports undo/redo in future

**Trade-offs**:
- ✅ Predictable behavior
- ✅ Thread-safe by design
- ✅ Easier testing
- ❌ Slightly more memory allocations
- ❌ More verbose update syntax

**Decision**: Benefits to maintainability and correctness justify slight performance cost

---

### AD-4: Manual Testing in Phase-1
**Rationale**: Faster initial development, deferred unit testing to future iteration

**Trade-offs**:
- ✅ Faster time to working MVP
- ✅ Focus on end-to-end validation
- ❌ No automated regression testing
- ❌ Requires manual verification

**Decision**: Manual testing sufficient for Phase-1, unit tests added in Phase-2

---

## References

- **Constitution**: `/mnt/g/Todo-app/.specify/memory/constitution.md`
- **Feature Spec**: `/mnt/g/Todo-app/specs/001-console-todo-app/spec.md`
- **Research**: `/mnt/g/Todo-app/specs/001-console-todo-app/research.md`
- **Data Model**: `/mnt/g/Todo-app/specs/001-console-todo-app/data-model.md`
- **CLI Contract**: `/mnt/g/Todo-app/specs/001-console-todo-app/contracts/cli-interface.md`
- **Quickstart**: `/mnt/g/Todo-app/specs/001-console-todo-app/quickstart.md`
