# Frontend Security Checklist

**Feature**: 003-frontend-auth-dashboard
**Created**: 2026-01-04
**Status**: Draft

## Checklist

### Authentication

- [ ] JWT tokens are issued by Better Auth using secure secret
- [ ] Tokens are stored in httpOnly cookies (preferred) or secure localStorage
- [ ] Tokens are not stored in plain text or localStorage without security flags
- [ ] Token expiration is handled with automatic refresh or redirect
- [ ] Tokens are invalidated on signout
- [ ] Password is transmitted securely over HTTPS
- [ ] Password complexity requirements are enforced during signup
- [ ] Email addresses are validated on client and server
- [ ] Session is protected against CSRF attacks (Better Auth built-in protection)
- [ ] Rate limiting is configured (prevent brute force attacks)

### Data Protection

- [ ] All API requests include JWT token in Authorization header
- [ ] Tokens are not exposed in URL parameters or query strings
- [ ] User data is isolated per user (cannot access other users' tasks)
- [ ] Sensitive information is not logged or exposed in error messages
- [ ] Input sanitization prevents XSS attacks
- [ ] SQL injection protection via parameterized queries (backend enforced)
- [ ] Content Security Policy headers are configured

### Access Control

- [ ] Protected routes check authentication status before rendering
- [ ] AuthGuard middleware wraps all protected pages
- [ ] Unauthenticated users are redirected to signin page
- [ ] User can only access their own data (user_id validation in backend)
- [ ] Signout clears session and invalidates token
- [ ] Token expiration triggers automatic redirect to signin
- [ ] Cross-user data access returns 403 Forbidden

### Input Validation

- [ ] All user inputs are validated on both client and server
- [ ] Email format is validated using HTML5 spec
- [ ] Password complexity requirements are enforced (minimum length, character types)
- [ ] Form fields have proper validation error messages
- [ ] Input truncation prevents overflow attacks
- [ ] File uploads are restricted to allowed types (N/A - no file uploads)
- [ ] Character encoding is UTF-8 (default in Next.js)

### Error Handling

- [ ] Authentication errors (401, 403) redirect to signin page with user-friendly message
- [ ] Validation errors (400, 422) show clear, actionable messages
- [ ] Not found errors (404) indicate resource doesn't exist
- [ ] Server errors (500+) show generic error with retry option
- [ ] Network errors are handled gracefully with retry logic
- [ ] Error states are displayed without exposing sensitive information
- [ ] Error messages do not reveal system internals or stack traces to users

### Secure Communication

- [ ] API communication uses HTTPS in production
- [ ] TLS/SSL certificates are validated
- [ ] HSTS headers are configured
- [ ] Content Security Policy is configured
- [ ] X-Content-Type-Options-Nosniff is configured

### Session Management

- [ ] Sessions expire after reasonable inactivity timeout
- [ ] Concurrent sessions are properly handled (Better Auth default)
- [ ] Session tokens are rotated periodically
- [ ] Remember me functionality is optional and secure
- [ ] Signout invalidates all session tokens

---

**Total**: 35 items
**Completed**: 0
**In Progress**: 0
**Incomplete**: 35

---

**Usage**: Fill out checklist items as [X] for completed tasks as they are implemented.
