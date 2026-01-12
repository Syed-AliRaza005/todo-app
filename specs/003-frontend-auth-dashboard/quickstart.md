# Quick Start Guide: Frontend Authentication and Dashboard

**Feature**: 003-frontend-auth-dashboard
**Date**: 2026-01-04
**Phase**: 1 - Design & Contracts

---

## Overview

This guide provides step-by-step instructions to set up the Next.js frontend project for the authentication and dashboard feature. Follow these steps to initialize the project structure, configure dependencies, and prepare for implementation.

---

## Prerequisites

Before starting, ensure you have:
- Node.js 20+ installed
- Package manager (npm, yarn, pnpm, or bun)
- Access to the backend FastAPI API (running on http://localhost:8000 or specified URL)
- PostgreSQL database configured in the backend
- Better Auth secret available (`BETTER_AUTH_SECRET`)

---

## Step 1: Initialize Next.js Project

Create a new Next.js 16+ project with TypeScript:

```bash
# Using npm
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir

# Using yarn
yarn create next-app frontend --typescript --tailwind --app --no-src-dir

# Using pnpm
pnpm create next-app frontend --typescript --tailwind --app --no-src-dir

# Using bun
bunx create-next-app frontend --typescript --tailwind --app --no-src-dir
```

Navigate to the project directory:

```bash
cd frontend
```

---

## Step 2: Install Dependencies

Install required dependencies for authentication, state management, and UI components:

```bash
# Core dependencies
npm install better-auth @tanstack/react-query date-fns clsx tailwind-merge

# Development dependencies
npm install -D @types/node @types/react @types/react-dom

# UI component library (optional but recommended)
npm install @headlessui/react

# Testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier
```

---

## Step 3: Configure Tailwind CSS

Tailwind is already configured by the Next.js CLI. Verify `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors matching constitution requirements
        pending: "#FBBF24",  // Yellow/amber
        completed: "#22C55E", // Green
        primary: "#3B82F6",  // Blue
      },
    },
  },
  plugins: [],
}
export default config
```

---

## Step 4: Setup Project Structure

Create the directory structure as defined in the plan:

```bash
# Create component directories
mkdir -p components/auth components/task components/ui components/layout
mkdir -p hooks lib types
mkdir -p __tests__/unit/components __tests__/unit/hooks
mkdir -p __tests__/e2e
```

---

## Step 5: Configure TypeScript

Update `tsconfig.json` if needed:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## Step 6: Configure Better Auth

Create Better Auth configuration file at `lib/auth.ts`:

```typescript
import { auth } from "better-auth/client"

export const { signIn, signUp, signOut, useSession } = auth({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  credentials: "include",
})
```

Add environment variables to `.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Secret (must match backend)
BETTER_AUTH_SECRET=your-secret-key-here
```

---

## Step 7: Setup React Query Provider

Wrap the app with React Query Provider in `app/layout.tsx`:

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

---

## Step 8: Configure Environment Variables

Create `.env.example` file:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Secret
BETTER_AUTH_SECRET=your-secret-key-change-in-production
```

Update `.gitignore` to exclude sensitive files:

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Build outputs
.next
out
dist
```

---

## Step 9: Configure Testing

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: nextJest.moduleNameMapper,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': nextJest.transformer,
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|scss|sass)$',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

module.exports = config
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'
```

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
})
```

---

## Step 10: Verify Setup

Run the following commands to verify everything is configured correctly:

```bash
# Install dependencies
npm install

# Run TypeScript check
npm run type-check

# Run linter
npm run lint

# Run development server
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

---

## Step 11: Backend Connection

Verify the backend is running and accessible:

```bash
# Test backend health
curl http://localhost:8000/docs

# Or visit in browser
# http://localhost:8000/docs
```

Ensure the backend API URL in `.env.local` matches your backend configuration.

---

## Common Issues and Solutions

### Issue: Better Auth Configuration Errors

**Problem**: Error during Better Auth setup.

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Ensure backend is running
3. Check `BETTER_AUTH_SECRET` matches backend

### Issue: Tailwind Classes Not Working

**Problem**: Tailwind classes not applying styles.

**Solution**:
1. Verify `tailwind.config.ts` exists
2. Check `globals.css` imports Tailwind directives
3. Restart development server

### Issue: TypeScript Errors

**Problem**: Type errors in components or hooks.

**Solution**:
1. Run `npm run type-check` for detailed errors
2. Verify `tsconfig.json` paths are correct
3. Install missing type definitions

### Issue: Environment Variables Not Loading

**Problem**: `process.env` values are undefined.

**Solution**:
1. Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
2. Restart development server after adding variables
3. Verify `.env.local` file exists

---

## Next Steps

After completing the quickstart guide, you should have:

1. A working Next.js 16+ project with TypeScript
2. All required dependencies installed
3. Tailwind CSS configured
4. Better Auth configured for authentication
5. React Query provider set up
6. Testing framework configured
7. Project structure ready for implementation

Proceed to implementation following the phase breakdown in [plan.md](./plan.md):

- **Phase 2.1**: Project Foundation
- **Phase 2.2**: Authentication Flow
- **Phase 2.3**: Task Dashboard Core
- **Phase 2.4**: Task Operations
- **Phase 2.5**: Task Management Features
- **Phase 2.6**: Enhanced Features
- **Phase 2.7**: Polish & Testing

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
