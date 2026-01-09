# Research Findings: Frontend Authentication and Dashboard

**Feature**: 003-frontend-auth-dashboard
**Date**: 2026-01-04
**Phase**: 0 - Outline & Research

---

## Research Summary

This document captures the research findings for technology choices, integration patterns, and best practices for implementing the frontend authentication and dashboard feature. All research tasks from Phase 0 have been completed and decisions documented below.

---

## 1. Better Auth Integration Pattern

### Research Question
How does Better Auth integrate with Next.js 16+ App Router for JWT token management and authentication flows?

### Decision
Use Better Auth as the authentication solution with JWT tokens stored in httpOnly cookies for security.

### Rationale
Better Auth provides:
- Built-in Next.js 16+ App Router support
- Simple API for signin/signup/signout operations
- Automatic JWT token generation and validation
- Session management with token refresh
- Secure cookie-based storage (httpOnly, secure, sameSite)
- Minimal configuration required

### Alternatives Considered

| Alternative | Pros | Cons | Rejection Reason |
|-------------|------|------|------------------|
| Auth.js (NextAuth) | Mature, widely used | More configuration overhead | Better Auth is simpler and more modern |
| Custom JWT implementation | Full control | Complex to implement correctly | Security risks, reinventing wheel |
| Supabase Auth | Feature-rich | Vendor lock-in | Constitution requires Better Auth |

### Implementation Notes

```typescript
// lib/auth.ts
import { auth } from "better-auth/client"

export const { signIn, signUp, signOut, useSession } = auth({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  credentials: "include", // Include cookies in requests
})
```

### Token Storage Strategy
- **Decision**: httpOnly cookies (via Better Auth)
- **Rationale**: More secure than localStorage (inaccessible to XSS)
- **Fallback**: If cookie support is not available, use localStorage with careful security measures

---

## 2. API Client Architecture

### Research Question
What is the best approach for building an HTTP client that includes JWT authentication and handles errors gracefully?

### Decision
Use React Query (@tanstack/react-query) with a custom fetch wrapper that includes JWT tokens.

### Rationale
React Query provides:
- Automatic data fetching, caching, and synchronization
- Built-in loading states and error handling
- Optimistic updates support
- Automatic retries for failed requests
- DevTools for debugging
- TypeScript support out of the box
- Server state management (simplifies client state)

### Alternatives Considered

| Alternative | Pros | Cons | Rejection Reason |
|-------------|------|------|------------------|
| SWR | Smaller bundle, simpler API | Less feature-rich | React Query has better TypeScript support |
| Axios | Rich feature set | Larger bundle | Native fetch is sufficient |
| Custom fetch only | No dependencies | Manual caching/error handling | React Query is more battle-tested |

### Implementation Pattern

```typescript
// lib/api.ts
import { useSession } from "@/lib/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = useSession.getState().session

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      window.location.href = "/signin"
      throw new Error("Unauthorized")
    }
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
}
```

### Error Handling Strategy
- **401/403**: Redirect to signin page
- **422**: Show validation errors to user
- **500+**: Show generic error message with retry option
- **Network errors**: Retry up to 3 times with exponential backoff

---

## 3. State Management

### Research Question
What state management approach is optimal for task CRUD operations and UI state?

### Decision
Use React Query for server state (tasks) and React Context for UI state (modals, filters).

### Rationale
This separation provides:
- **React Query**: Manages server state (tasks) with caching, synchronization, and optimistic updates
- **React Context**: Manages UI state (modal open/closed, active filter) with minimal boilerplate
- Clear separation of concerns
- No need for additional state management libraries

### Alternatives Considered

| Alternative | Pros | Cons | Rejection Reason |
|-------------|------|------|------------------|
| Zustand | Simple API, minimal boilerplate | Adds another dependency | Context is sufficient for UI state |
| Redux Toolkit | Powerful ecosystem | Overkill for this scope | Too complex for simple task app |
| Jotai | Atomic state | Less familiar to developers | Context + React Query is simpler |

### State Architecture

```typescript
// Server State (React Query)
const useTasks = () => useQuery({
  queryKey: ["tasks"],
  queryFn: () => api.get<Task[]>("/api/user_id/tasks"),
})

// UI State (React Context)
const TaskUIContext = createContext<{
  isModalOpen: boolean
  activeFilter: "All" | "Pending" | "Completed"
  selectedTask: Task | null
  openModal: (task?: Task) => void
  closeModal: () => void
  setFilter: (filter: "All" | "Pending" | "Completed") => void
} | null>(null)
```

### Optimistic Update Strategy
React Query provides `onMutate`, `onSuccess`, and `onError` callbacks for optimistic updates:

```typescript
const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task: Task) => api.put<Task>(`/api/user_id/tasks/${task.id}`, task),
    onMutate: async (updatedTask) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] })

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(["tasks"])

      // Optimistically update
      queryClient.setQueryData(["tasks"], (old: Task[] | undefined) =>
        old?.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      )

      return { previousTasks }
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      queryClient.setQueryData(["tasks"], context?.previousTasks)
    },
    onSettled: () => {
      // Refetch on success or error
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
```

---

## 4. Responsive Design Patterns

### Research Question
What Tailwind CSS patterns ensure mobile-first responsive design with proper accessibility?

### Decision
Use Tailwind's mobile-first responsive utilities with defined breakpoints and accessibility-first component design.

### Rationale
Tailwind provides:
- Mobile-first responsive utilities (`sm:`, `md:`, `lg:`)
- Consistent design system through utility classes
- Accessibility utilities (`sr-only`, `focus-visible`)
- Easy prototyping and iteration

### Breakpoint Strategy

| Breakpoint | Screen Width | Use Case |
|------------|--------------|----------|
| Base | < 640px (mobile) | Single column, touch-friendly |
| sm | 640px+ | Small tablets, landscape mobile |
| md | 768px+ | Tablets, small desktops |
| lg | 1024px+ | Desktops |
| xl | 1280px+ | Large desktops |

### Responsive Patterns

```tsx
// Mobile-first: Single column by default, multi-column on larger screens
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Task items */}
</div>

// Responsive text
<h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Task Dashboard</h1>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>
```

### Touch Target Accessibility
- **Minimum size**: 44x44px (WCAG 2.1 AA)
- **Implementation**: Use Tailwind's `min-h-[44px] min-w-[44px]` utilities

```tsx
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Complete Task
</button>
```

### Accessibility Best Practices
- Use semantic HTML (`<button>`, `<input>`, `<label>`)
- Add ARIA labels for icon-only buttons
- Ensure keyboard navigation works
- Use `focus-visible` for keyboard focus styles
- Provide skip links for keyboard users
- Test with screen readers

---

## 5. Testing Strategy

### Research Question
What testing tools and patterns ensure comprehensive test coverage for authentication flows and task operations?

### Decision
Use Jest + React Testing Library for unit/integration tests and Playwright for E2E tests.

### Rationale
This combination provides:
- **Jest + RTL**: Fast unit tests for components and hooks
- **Playwright**: Cross-browser E2E tests with modern APIs
- Both have excellent TypeScript support
- Good community and documentation

### Alternatives Considered

| Alternative | Pros | Cons | Rejection Reason |
|-------------|------|------|------------------|
| Vitest | Faster, native ESM | Less mature for React | Jest is more established |
| Cypress | Good developer experience | Slower, more setup | Playwright is faster and more modern |
| Testing Library only | Simple | No E2E coverage | Need E2E for critical flows |

### Test Structure

```
Frontend/
├── __tests__/
│   ├── unit/
│   │   ├── components/
│   │   │   ├── TaskItem.test.tsx
│   │   │   └── TaskForm.test.tsx
│   │   └── hooks/
│   │       ├── useAuth.test.ts
│   │       └── useTasks.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       ├── tasks.spec.ts
│       └── filters.spec.ts
```

### Testing Patterns

**Unit Test Example (React Testing Library):**
```typescript
import { render, screen } from "@testing-library/react"
import { TaskItem } from "@/components/task/TaskItem"

describe("TaskItem", () => {
  it("displays task title and description", () => {
    const task = {
      id: "1",
      title: "Test Task",
      description: "Test Description",
      status: "Pending",
      created_at: "2026-01-04T00:00:00Z",
    }

    render(<TaskItem task={task} onComplete={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText("Test Task")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
  })
})
```

**E2E Test Example (Playwright):**
```typescript
import { test, expect } from "@playwright/test"

test("user can create a task", async ({ page }) => {
  // Login
  await page.goto("/signin")
  await page.fill('input[name="email"]', "test@example.com")
  await page.fill('input[name="password"]', "password123")
  await page.click('button[type="submit"]')

  // Navigate to dashboard
  await expect(page).toHaveURL("/dashboard")

  // Create task
  await page.click('button:has-text("Add Task")')
  await page.fill('input[name="title"]', "New Task")
  await page.fill('textarea[name="description"]', "Task description")
  await page.click('button:has-text("Create Task")')

  // Verify task appears
  await expect(page.locator("text=New Task")).toBeVisible()
})
```

### Test Coverage Goals
- Unit tests: 80%+ coverage for components and hooks
- Integration tests: Critical user flows (auth, CRUD)
- E2E tests: Happy path + error scenarios for primary user journeys

---

## Summary of Decisions

| Research Area | Decision | Key Technology |
|---------------|----------|----------------|
| Authentication | Better Auth with httpOnly cookies | better-auth |
| API Client | React Query with custom fetch | @tanstack/react-query |
| State Management | React Query (server) + React Context (UI) | React Query, React Context |
| Responsive Design | Tailwind CSS mobile-first | tailwindcss |
| Testing | Jest + RTL (unit), Playwright (E2E) | jest, @testing-library/react, playwright |

---

## Open Questions

None - all research areas have been resolved with clear decisions and implementation guidance.

---

## References

- [Better Auth Documentation](https://better-auth.com)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
