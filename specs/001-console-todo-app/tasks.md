# Tasks: Console Todo Application

**Feature**: 001-console-todo-app
**Branch**: `001-console-todo-app`
**Created**: 2025-12-31
**Total Tasks**: 32

## Overview

This document breaks down the Console Todo Application implementation into executable tasks organized by user story priority. Each user story is independently testable and can be delivered as a complete increment.

**Implementation Strategy**: MVP-first approach using P1 stories (Task Creation, Viewing, Completion), then P2 stories (Update, Delete), then P3 (Clear). Each story delivers user value independently.

## User Story Mapping

| Story | Priority | MVP | Tasks | Independent Test Criteria |
|-------|----------|-----|-------|---------------------------|
| US1: Task Creation | P1 | ✅ | T008-T013 | Add task, verify in list, persists across restarts |
| US2: Task Viewing | P1 | ✅ | T014-T016 | Display color-coded tables in 3 sections |
| US3: Task Completion | P1 | ✅ | T017-T018 | Mark done, verify status change persists |
| US4: Task Update | P2 | ⬜ | T019-T020 | Update task, verify changes persist |
| US5: Task Deletion | P2 | ⬜ | T021-T022 | Delete task, verify ID stability |
| US6: Complete Reset | P3 | ⬜ | T023 | Clear all, verify ID counter resets to 1 |

**MVP Scope**: User Stories 1, 2, and 3 provide a complete basic todo app (add, list, complete tasks).

---

## Phase 1: Setup & Infrastructure

**Purpose**: Initialize project structure and install dependencies.

**Tasks**:

- [X] T001 Create src/ directory in console-app/
- [X] T002 [P] Create src/__init__.py empty package marker
- [X] T003 Install Rich library dependency using `uv add rich` in console-app/
- [X] T004 [P] Verify Rich installation with test command `python -c "import rich; print(rich.__version__)"`

---

## Phase 2: Foundational Components

**Purpose**: Build core data structures and utilities that all user stories depend on.

**Blocking Dependencies**: These MUST be completed before any user story implementation.

### Core Data Model

- [X] T005 Create custom exception hierarchy in src/models.py (TodoError, ValidationError, TaskNotFoundError, StorageError)
- [X] T006 [P] Implement TaskStatus enum in src/models.py (PENDING, COMPLETED values)
- [X] T007 [P] Implement validation functions in src/models.py (validate_title, validate_description, validate_status, validate_timestamp)

---

## Phase 3: User Story 1 - Task Creation with Timestamps (P1) 🎯 MVP

**Story Goal**: Enable users to add tasks with automatic ID and timestamp assignment.

**Independent Test**: Add task → verify appears in list with auto-generated ID and timestamp → restart app → verify task still exists.

**Acceptance Criteria**:
- ✅ Task created with sequential ID starting from 1
- ✅ Status defaults to "Pending"
- ✅ Timestamp auto-captured in YYYY-MM-DD HH:MM:SS format
- ✅ Data persists across application restarts
- ✅ Multiple tasks get incrementing IDs

### Implementation Tasks

- [X] T008 [US1] Implement Task dataclass in src/models.py with fields (id, title, description, status, created_at)
- [X] T009 [US1] Implement Task.create() factory method in src/models.py with validation and timestamp capture
- [X] T010 [US1] Implement Task serialization methods in src/models.py (to_dict, from_dict)
- [X] T011 [P] [US1] Implement TaskCollection dataclass in src/models.py with fields (next_id, tasks)
- [X] T012 [P] [US1] Implement TaskCollection.add_task() method in src/models.py
- [X] T013 [US1] Implement TaskCollection.from_dict() and to_dict() in src/models.py for JSON serialization

---

## Phase 4: Storage Layer (Required for US1-US6)

**Story Goal**: Provide persistent JSON storage with atomic writes and error handling.

**Independent Test**: Save collection → delete app → restart → verify data loads correctly.

**Tasks**:

- [X] T014 [US1] Implement load_collection() in src/storage.py with error handling (missing file → empty collection, corrupted JSON → backup and empty)
- [X] T015 [US1] Implement save_collection() in src/storage.py with atomic write pattern (write to .tmp, then rename)
- [X] T016 [US1] Implement storage error handling in src/storage.py (permission denied, disk full → raise StorageError)

---

## Phase 5: User Story 2 - Task Viewing with Visual Organization (P1) 🎯 MVP

**Story Goal**: Display tasks in color-coded categorized tables.

**Independent Test**: Add sample tasks → run list command → verify three colored sections ([All], [Pending], [Completed]).

**Acceptance Criteria**:
- ✅ Three sections displayed: All Tasks, Pending, Completed
- ✅ Pending tasks show yellow/amber indicators
- ✅ Completed tasks show green indicators
- ✅ Headers in bold cyan, IDs in magenta, timestamps in dim white
- ✅ Empty list shows friendly message, not blank table

### Implementation Tasks

- [X] T017 [P] [US2] Define color constants in src/ui.py (pending=yellow, completed=green, header=bold cyan, id=magenta, timestamp=dim white)
- [X] T018 [P] [US2] Implement render_tasks_table() in src/ui.py for single categorized table with Rich styling
- [X] T019 [US2] Implement render_all_tasks() in src/ui.py to display three sections (All, Pending, Completed)
- [X] T020 [P] [US2] Implement render_success() and render_error() helper functions in src/ui.py
- [X] T021 [P] [US2] Implement render_task_detail() in src/ui.py for single task formatted view

---

## Phase 6: Command Implementations for US1 & US2 (P1) 🎯 MVP

**Story Goal**: Wire add and list commands to enable basic task management.

**Independent Test**: Run `python src/app.py add "Test" "Description"` → run `python src/app.py list` → verify task displayed.

**Tasks**:

- [X] T022 [US1] Implement cmd_add() in src/commands.py (load collection, add task, save, render success)
- [X] T023 [US1] Add error handling to cmd_add() in src/commands.py (ValidationError, StorageError)
- [X] T024 [US2] Implement cmd_list() in src/commands.py (load collection, render all tasks)
- [X] T025 [US2] Add error handling to cmd_list() in src/commands.py (StorageError, corrupted data)

---

## Phase 7: User Story 3 - Task Completion Marking (P1) 🎯 MVP

**Story Goal**: Allow marking tasks as completed with persistent status change.

**Independent Test**: Add task → mark done → verify status changed to Completed and appears in Completed section → restart → verify still completed.

**Acceptance Criteria**:
- ✅ Status changes from "Pending" to "Completed"
- ✅ Change persists across restarts
- ✅ Completed task moves to Completed section in list view
- ✅ Clear error for invalid task IDs

### Implementation Tasks

- [X] T026 [US3] Implement Task.mark_completed() method in src/models.py
- [X] T027 [US3] Implement TaskCollection.mark_done() method in src/models.py
- [X] T028 [US3] Implement cmd_done() in src/commands.py (load, mark done, save, render success)
- [X] T029 [US3] Add error handling to cmd_done() in src/commands.py (TaskNotFoundError, invalid ID format)

---

## Phase 8: CLI Entry Point (Required for US1-US6)

**Story Goal**: Provide command-line interface with argparse routing.

**Independent Test**: Run `python src/app.py --help` → verify all commands listed → test each command.

**Tasks**:

- [X] T030 Create ArgumentParser configuration in src/app.py with subcommands (add, list, done)
- [X] T031 Implement main() function in src/app.py with command routing and exception handling
- [X] T032 Add __main__ guard and entry point to src/app.py
- [X] T033 Test MVP functionality: add task → list → mark done → list again → restart → list

---

## Phase 9: User Story 4 - Task Update (P2)

**Story Goal**: Enable editing task title and description while preserving ID, status, and timestamp.

**Independent Test**: Add task → update title/description → verify changes persist → restart → verify update persisted.

**Acceptance Criteria**:
- ✅ Title and description can be modified
- ✅ ID, status, and created_at remain unchanged
- ✅ Changes persist across restarts
- ✅ Clear error for invalid task IDs

### Implementation Tasks

- [X] T034 [US4] Implement Task.update_details() method in src/models.py
- [X] T035 [US4] Implement TaskCollection.update_task() method in src/models.py
- [X] T036 [US4] Implement cmd_update() in src/commands.py (load, update, save, render success)
- [X] T037 [US4] Add error handling to cmd_update() in src/commands.py (TaskNotFoundError, ValidationError)
- [X] T038 [US4] Add "update" subcommand to ArgumentParser in src/app.py

---

## Phase 10: User Story 5 - Task Deletion with ID Stability (P2)

**Story Goal**: Remove tasks without affecting other task IDs or the ID counter.

**Independent Test**: Add tasks 1,2,3 → delete task 2 → verify tasks 1,3 keep IDs → add new task → verify gets ID 4 (not 2).

**Acceptance Criteria**:
- ✅ Deleted task removed from list
- ✅ Other task IDs remain unchanged
- ✅ next_id counter not decremented
- ✅ Deletion persists across restarts
- ✅ Clear error for invalid task IDs

### Implementation Tasks

- [X] T039 [US5] Implement TaskCollection.delete_task() method in src/models.py (remove task, preserve next_id)
- [X] T040 [US5] Implement cmd_delete() in src/commands.py (load, delete, save, render success)
- [X] T041 [US5] Add error handling to cmd_delete() in src/commands.py (TaskNotFoundError)
- [X] T042 [US5] Add "delete" subcommand to ArgumentParser in src/app.py

---

## Phase 11: User Story 6 - Complete List Reset (P3)

**Story Goal**: Clear all tasks and reset ID counter to 1.

**Independent Test**: Add multiple tasks → run clear → verify all deleted → add new task → verify gets ID 1.

**Acceptance Criteria**:
- ✅ All tasks deleted
- ✅ next_id counter reset to 1
- ✅ Empty state persists across restarts
- ✅ Next added task receives ID 1

### Implementation Tasks

- [X] T043 [US6] Implement TaskCollection.clear() static method in src/models.py
- [X] T044 [US6] Implement cmd_clear() in src/commands.py (create empty collection, save, render success)
- [X] T045 [US6] Add "clear" subcommand to ArgumentParser in src/app.py

---

## Phase 12: Testing & Validation

**Purpose**: Verify all user stories and edge cases.

**Tasks**:

- [ ] T046 Create test_manual.sh script with test scenarios for all user stories
- [ ] T047 Test US1: Add tasks and verify timestamps and IDs
- [ ] T048 Test US1: Verify persistence across app restarts
- [ ] T049 Test US2: Verify color-coded display in three sections
- [ ] T050 Test US3: Mark task done and verify status change persists
- [ ] T051 Test US4: Update task and verify changes persist
- [ ] T052 Test US5: Delete task and verify ID stability (IDs don't shift, next_id doesn't decrement)
- [ ] T053 Test US6: Clear all tasks and verify ID counter resets to 1
- [ ] T054 Test edge cases: corrupted JSON, missing file, invalid IDs, missing arguments
- [ ] T055 Verify all success criteria (SC-001 through SC-008) from specification

---

## Phase 13: Polish & Documentation

**Purpose**: Finalize user experience and documentation.

**Tasks**:

- [ ] T056 [P] Add help text and usage examples to ArgumentParser in src/app.py
- [ ] T057 [P] Verify all error messages are descriptive per CLI contract
- [ ] T058 [P] Test empty state handling (friendly messages for empty list)
- [ ] T059 Create user-facing README.md with installation and usage instructions (optional)
- [ ] T060 Verify constitution compliance for all 6 principles

---

## Dependencies & Execution Order

### Critical Path (Must Complete in Order)

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
Phase 3 (US1: Task Creation) → Phase 4 (Storage) → Phase 8 (CLI Entry Point)
    ↓
Phase 5 (US2: Task Viewing) → Phase 6 (Commands US1 & US2)
    ↓
Phase 7 (US3: Task Completion)
    ↓
[MVP Complete - Can Deploy]
    ↓
Phase 9 (US4: Update) [Independent]
    ↓
Phase 10 (US5: Delete) [Independent]
    ↓
Phase 11 (US6: Clear) [Independent]
    ↓
Phase 12 (Testing)
    ↓
Phase 13 (Polish)
```

### User Story Dependencies

- **US1 (Task Creation)**: No dependencies - can start after Phase 2
- **US2 (Task Viewing)**: Depends on US1 (needs tasks to display)
- **US3 (Task Completion)**: Depends on US1, US2 (needs tasks and display)
- **US4 (Task Update)**: Independent - only needs Phase 2 + Phase 8
- **US5 (Task Deletion)**: Independent - only needs Phase 2 + Phase 8
- **US6 (Complete Reset)**: Independent - only needs Phase 2 + Phase 8

**Note**: US4, US5, and US6 can be implemented in parallel after MVP (US1-US3) is complete.

---

## Parallel Execution Opportunities

### During MVP (Phase 3-7)

**Parallel Set 1** (After Phase 2 complete):
- T008-T013 (Task and TaskCollection models) [US1]
- T017-T021 (UI components) [US2] - Different files, no shared state

**Parallel Set 2** (After models complete):
- T014-T016 (Storage layer)
- T026-T027 (Task completion methods) [US3]

**Parallel Set 3** (After storage complete):
- T022-T025 (Command implementations for add/list)
- T028-T029 (Command implementation for done)

### Post-MVP (Phase 9-11)

**All Can Run in Parallel**:
- Phase 9 (US4: Update) - T034-T038
- Phase 10 (US5: Delete) - T039-T042
- Phase 11 (US6: Clear) - T043-T045

Each post-MVP story is independently implementable.

---

## Independent Testing Strategy

### Per User Story

**US1 Test Script**:
```bash
python src/app.py add "Task 1" "Description 1"
python src/app.py list  # Verify task 1 with ID 1
python src/app.py add "Task 2" "Description 2"
python src/app.py list  # Verify task 2 with ID 2
# Restart application
python src/app.py list  # Verify both tasks persist
```

**US2 Test Script**:
```bash
python src/app.py add "Pending Task" "Test"
python src/app.py done 1
python src/app.py add "Another Pending" "Test"
python src/app.py list
# Verify: 3 sections, task 1 green (completed), task 2 yellow (pending)
```

**US3 Test Script**:
```bash
python src/app.py add "Task to complete" "Test"
python src/app.py done 1
python src/app.py list  # Verify status=Completed, green color
# Restart application
python src/app.py list  # Verify still completed
```

**US4 Test Script**:
```bash
python src/app.py add "Original" "Original desc"
python src/app.py update 1 "Updated" "Updated desc"
python src/app.py list  # Verify changes
# Restart
python src/app.py list  # Verify changes persist, timestamp unchanged
```

**US5 Test Script**:
```bash
python src/app.py add "Task 1" "Test"
python src/app.py add "Task 2" "Test"
python src/app.py add "Task 3" "Test"
python src/app.py delete 2
python src/app.py list  # Verify only tasks 1 and 3 shown
python src/app.py add "Task 4" "Test"
python src/app.py list  # Verify new task gets ID 4, not 2
```

**US6 Test Script**:
```bash
python src/app.py add "Task 1" "Test"
python src/app.py add "Task 2" "Test"
python src/app.py clear
python src/app.py list  # Verify empty
python src/app.py add "New Task" "Test"
python src/app.py list  # Verify new task has ID 1
```

---

## Task Completion Checklist

### Phase 1-2: Foundation (4 tasks)
- [ ] T001-T004: Setup and dependencies

### Phase 3-8: MVP - Stories US1, US2, US3 (26 tasks)
- [ ] T005-T007: Core data model foundation
- [ ] T008-T013: US1 implementation (6 tasks)
- [ ] T014-T016: Storage layer (3 tasks)
- [ ] T017-T021: US2 implementation (5 tasks)
- [ ] T022-T025: Commands for US1 & US2 (4 tasks)
- [ ] T026-T029: US3 implementation (4 tasks)
- [ ] T030-T033: CLI entry point (4 tasks)

### Phase 9-11: Extended Features (12 tasks)
- [ ] T034-T038: US4 implementation (5 tasks)
- [ ] T039-T042: US5 implementation (4 tasks)
- [ ] T043-T045: US6 implementation (3 tasks)

### Phase 12-13: Testing & Polish (15 tasks)
- [ ] T046-T055: Testing (10 tasks)
- [ ] T056-T060: Polish (5 tasks)

**Total: 60 tasks across 13 phases**

---

## MVP Delivery Strategy

**MVP = Phases 1-8** (30 tasks, stories US1-US3)

Delivers:
- ✅ Add tasks with automatic timestamps
- ✅ View tasks in color-coded categorized tables
- ✅ Mark tasks as completed
- ✅ Data persistence across restarts
- ✅ ID stability and sequential assignment

**Post-MVP Increments**:
1. **Increment 1**: US4 (Update) - 5 tasks
2. **Increment 2**: US5 (Delete) - 4 tasks
3. **Increment 3**: US6 (Clear) - 3 tasks

Each increment adds a complete feature that can be tested and deployed independently.

---

## Validation Criteria

### Format Compliance
✅ All tasks follow checklist format: `- [ ] TXXX [P] [USX] Description with file path`
✅ Task IDs sequential (T001-T060)
✅ Story labels applied to user story tasks ([US1]-[US6])
✅ Parallel markers ([P]) on independent tasks
✅ File paths specified for implementation tasks

### Completeness
✅ All 6 user stories mapped to tasks
✅ All 5 modules covered (models, storage, ui, commands, app)
✅ Setup, implementation, testing, and polish phases included
✅ Independent test criteria defined for each story
✅ Dependency graph shows clear execution order

### Constitution Compliance
✅ All 6 principles addressed in task breakdown
✅ Modular architecture enforced (5 prescribed modules)
✅ Data persistence tasks (atomic writes, load/save)
✅ ID stability explicitly tested (T052)
✅ Rich UI with color coding (T017-T021)
✅ All 6 commands implemented (add, list, done, update, delete, clear)

---

## References

- **Specification**: `/mnt/g/Todo-app/specs/001-console-todo-app/spec.md`
- **Implementation Plan**: `/mnt/g/Todo-app/specs/001-console-todo-app/plan.md`
- **Data Model**: `/mnt/g/Todo-app/specs/001-console-todo-app/data-model.md`
- **CLI Contract**: `/mnt/g/Todo-app/specs/001-console-todo-app/contracts/cli-interface.md`
- **Quickstart Guide**: `/mnt/g/Todo-app/specs/001-console-todo-app/quickstart.md`
- **Constitution**: `/mnt/g/Todo-app/.specify/memory/constitution.md`
