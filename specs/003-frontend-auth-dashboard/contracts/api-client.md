# API Client Contract

**Feature**: 003-frontend-auth-dashboard
**Date**: 2026-01-04
**Phase**: 1 - Design & Contracts

---

## Overview

This document defines the API client contract between the Next.js frontend and the FastAPI backend. The backend API is specified in the constitution (Phase-2) and this contract serves as a TypeScript interface layer ensuring type-safe API communication.

---

## Base Configuration

### API Base URL

```typescript
// lib/constants.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
```

### Authentication Headers

All API requests (except authentication endpoints) MUST include the JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

### Error Handling

| HTTP Status | Meaning | Frontend Action |
|--------------|---------|------------------|
| 200 | Success | Process response |
| 201 | Created | Process response |
| 204 | No Content | Confirm success |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Redirect to signin page |
| 403 | Forbidden | Show access denied error |
| 404 | Not Found | Show resource not found error |
| 422 | Validation Error | Show field-specific errors |
| 429 | Too Many Requests | Show retry message |
| 500+ | Server Error | Show generic error with retry |

---

## Authentication Endpoints

### POST /auth/signup

Register a new user account.

**Request Body**:
```typescript
{
  email: string
  password: string
  name?: string
}
```

**Response (200 OK)**:
```typescript
{
  user: {
    id: string (UUID)
    email: string
    name: string | null
    createdAt: string (ISO 8601)
    updatedAt: string (ISO 8601)
  }
  token: string (JWT)
}
```

**Response (400 Bad Request - Email exists)**:
```typescript
{
  detail: "Email already registered"
}
```

**Response (422 Validation Error)**:
```typescript
{
  detail: {
    email: ["Invalid email format"]
    password: ["Password must be at least 8 characters"]
  }
}
```

**TypeScript Interface**:
```typescript
export interface SignupRequest {
  email: string
  password: string
  name?: string
}

export interface SignupResponse {
  user: User
  token: string
}
```

---

### POST /auth/signin

Authenticate an existing user.

**Request Body**:
```typescript
{
  email: string
  password: string
}
```

**Response (200 OK)**:
```typescript
{
  user: User
  token: string (JWT)
}
```

**Response (400 Bad Request - Invalid credentials)**:
```typescript
{
  detail: "Invalid email or password"
}
```

**Response (401 Unauthorized)**:
```typescript
{
  detail: "Invalid credentials"
}
```

**TypeScript Interface**:
```typescript
export interface SigninRequest {
  email: string
  password: string
}

export interface SigninResponse {
  user: User
  token: string
}
```

---

### POST /auth/signout

Logout the current user (client-side token invalidation).

**Request Body**: None

**Response**: None (typically 204 No Content)

**Note**: This is managed by Better Auth and may be a client-side operation.

---

## Task Endpoints

### GET /api/{user_id}/tasks

Retrieve all tasks for a specific user.

**URL Parameters**:
- `user_id` (path parameter): UUID of the user

**Query Parameters** (optional):
- `status`: Filter tasks by status - `"Pending"` | `"Completed"` | `"All"`

**Response (200 OK)**:
```typescript
[
  {
    id: string (UUID)
    userId: string (UUID)
    title: string
    description: string | null
    status: "Pending" | "Completed"
    createdAt: string (ISO 8601)
    completedAt: string | null (ISO 8601)
    updatedAt: string (ISO 8601)
  }
]
```

**Response (401 Unauthorized)**:
```typescript
{
  detail: "Invalid token"
}
```

**Response (403 Forbidden)**:
```typescript
{
  detail: "Access denied"
}
```

**TypeScript Interface**:
```typescript
export interface GetTasksParams {
  status?: "Pending" | "Completed" | "All"
}

export type GetTasksResponse = Task[]
```

---

### POST /api/{user_id}/tasks

Create a new task for a user.

**URL Parameters**:
- `user_id` (path parameter): UUID of the user

**Request Body**:
```typescript
{
  title: string (required, max 500 chars)
  description?: string (optional, unlimited)
}
```

**Response (201 Created)**:
```typescript
{
  id: string (UUID)
  userId: string (UUID)
  title: string
  description: string | null
  status: "Pending"
  createdAt: string (ISO 8601)
  completedAt: null
  updatedAt: string (ISO 8601)
}
```

**Response (400 Bad Request)**:
```typescript
{
  detail: "Title is required"
}
```

**Response (401 Unauthorized)**:
```typescript
{
  detail: "Invalid token"
}
```

**Response (403 Forbidden)**:
```typescript
{
  detail: "Access denied"
}
```

**Response (422 Validation Error)**:
```typescript
{
  detail: {
    title: ["Title is required"]
  }
}
```

**TypeScript Interface**:
```typescript
export interface CreateTaskRequest {
  title: string
  description?: string
}

export interface CreateTaskResponse extends Task {}
```

---

### PUT /api/{user_id}/tasks/{task_id}

Update an existing task.

**URL Parameters**:
- `user_id` (path parameter): UUID of the user
- `task_id` (path parameter): UUID of the task

**Request Body**:
```typescript
{
  title?: string (max 500 chars)
  description?: string
  status?: "Pending" | "Completed"
}
```

**Response (200 OK)**:
```typescript
{
  id: string (UUID)
  userId: string (UUID)
  title: string
  description: string | null
  status: "Pending" | "Completed"
  createdAt: string (ISO 8601)
  completedAt: string | null
  updatedAt: string (ISO 8601)
}
```

**Response (400 Bad Request)**:
```typescript
{
  detail: "Title is required"
}
```

**Response (401 Unauthorized)**:
```typescript
{
  detail: "Invalid token"
}
```

**Response (403 Forbidden)**:
```typescript
{
  detail: "Access denied"
}
```

**Response (404 Not Found)**:
```typescript
{
  detail: "Task not found"
}
```

**Response (422 Validation Error)**:
```typescript
{
  detail: {
    title: ["Title cannot be empty"]
  }
}
```

**TypeScript Interface**:
```typescript
export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: TaskStatus
}

export interface UpdateTaskResponse extends Task {}
```

---

### DELETE /api/{user_id}/tasks/{task_id}

Delete a specific task.

**URL Parameters**:
- `user_id` (path parameter): UUID of the user
- `task_id` (path parameter): UUID of the task

**Response (204 No Content)**: Empty body

**Response (401 Unauthorized)**:
```typescript
{
  detail: "Invalid token"
}
```

**Response (403 Forbidden)**:
```typescript
{
  detail: "Access denied"
}
```

**Response (404 Not Found)**:
```typescript
{
  detail: "Task not found"
}
```

**TypeScript Interface**:
```typescript
export interface DeleteTaskResponse {
  // No content (204)
}
```

---

### PATCH /api/{user_id}/tasks/{task_id}/complete

Mark a task as completed.

**URL Parameters**:
- `user_id` (path parameter): UUID of the user
- `task_id` (path parameter): UUID of the task

**Response (200 OK)**:
```typescript
{
  id: string (UUID)
  userId: string (UUID)
  title: string
  description: string | null
  status: "Completed"
  createdAt: string (ISO 8601)
  completedAt: string (ISO 8601)
  updatedAt: string (ISO 8601)
}
```

**Response (401 Unauthorized)**:
```typescript
{
  detail: "Invalid token"
}
```

**Response (403 Forbidden)**:
```typescript
{
  detail: "Access denied"
}
```

**Response (404 Not Found)**:
```typescript
{
  detail: "Task not found"
}
```

**TypeScript Interface**:
```typescript
export interface CompleteTaskResponse {
  task: Task
  message: string
}
```

---

## Complete API Client Interface

```typescript
// lib/api.ts
import { useSession } from "@/lib/auth"

/**
 * Base API client with authentication
 */
export const api = {
  // Authentication
  signup: (data: SignupRequest) => Promise<SignupResponse>
  signin: (data: SigninRequest) => Promise<SigninResponse>
  signout: () => Promise<void>

  // Task operations
  getTasks: (userId: string, params?: GetTasksParams) => Promise<GetTasksResponse>
  createTask: (userId: string, data: CreateTaskRequest) => Promise<CreateTaskResponse>
  updateTask: (userId: string, taskId: string, data: UpdateTaskRequest) => Promise<UpdateTaskResponse>
  deleteTask: (userId: string, taskId: string) => Promise<DeleteTaskResponse>
  completeTask: (userId: string, taskId: string) => Promise<CompleteTaskResponse>
}
```

---

## Request/Response Types Summary

### Authentication Types

```typescript
export interface SignupRequest {
  email: string
  password: string
  name?: string
}

export interface SigninRequest {
  email: string
  password: string
}

export interface SignupResponse {
  user: User
  token: string
}

export interface SigninResponse {
  user: User
  token: string
}
```

### Task Types

```typescript
export type TaskStatus = "Pending" | "Completed"

export interface GetTasksParams {
  status?: "Pending" | "Completed" | "All"
}

export interface CreateTaskRequest {
  title: string
  description?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: TaskStatus
}

export interface GetTasksResponse extends Task[] {}
export interface CreateTaskResponse extends Task {}
export interface UpdateTaskResponse extends Task {}
export interface DeleteTaskResponse {
  // No content (204)
}

export interface CompleteTaskResponse {
  task: Task
  message: string
}
```

### Error Types

```typescript
export interface ApiError {
  detail: string | {
    [key: string]: string[]
  }
}

export type ApiErrorResponse = {
  status: number
  data: ApiError
}
```

---

## Summary

This API client contract provides:
- Complete TypeScript interfaces for all endpoints
- Clear request/response schemas
- Authentication and error handling patterns
- Type-safe API communication layer
- Alignment with backend API specified in constitution

The frontend will implement an API client that enforces these contracts, includes JWT tokens in headers, and handles errors appropriately according to the specified patterns.
