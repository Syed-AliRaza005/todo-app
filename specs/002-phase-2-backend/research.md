# Research Findings: Phase-2 Full-Stack Web Application Backend

**Feature**: 002-phase-2-backend | **Date**: 2026-01-03

## Overview

This document captures research decisions made during the planning phase for the Phase-2 backend implementation.

---

## Decision 1: JWT Token Revocation Strategy

**Question**: How to handle logout/token revocation server-side?

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| Token blacklist (Database) | Store revoked tokens with expiration in database | Simple, no extra infrastructure, immediate revocation | Slight DB overhead per request |
| Short token lifetime + refresh tokens | Require frequent re-authentication | No revocation needed, secure | Complex flow, poor UX |
| Token versioning | Include version in token, invalidate by version | Fast revocation, no DB lookups | Requires token version storage |

### Decision: Token blacklist with database table (RevokedToken)

**Rationale**:
- Simpler than refresh tokens - no additional infrastructure (Redis) required
- Matches constitution requirement FR-008 for server-side signout
- Using short expiration (24h) with server-side revocation covers most security concerns without complexity
- Database lookups for token revocation are acceptable for this scale (100 concurrent users)

**Implementation**:
- Create `RevokedToken` table with fields: `token_jti` (primary key), `user_id`, `expires_at`
- On every request, check if token JTI exists in revoked tokens table
- Clean up expired tokens periodically or use database expiration

---

## Decision 2: Password Hashing Algorithm

**Question**: Which password hashing algorithm to use for user authentication?

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| bcrypt | Widely used, good security, configurable work factor | Mature, well-tested, Python-jose compatible | Slightly older than argon2 |
| argon2 | Password Hashing Competition winner | Best GPU resistance, modern | Requires extra dependency |
| scrypt | Memory-hard function | Good security properties | More memory intensive |

### Decision: bcrypt (via passlib)

**Rationale**:
- Python-jose integrates seamlessly with passlib bcrypt
- Sufficient security for this application scope (consumer todo app)
- Lower implementation complexity
- argon2 would be preferred for higher-security applications (banking, healthcare)

**Implementation**:
- Use `passlib.context.CryptContext` with bcrypt as the default
- Configure appropriate rounds (12 is standard for bcrypt)

---

## Decision 3: Database Connection Management

**Question**: How to handle database connections in FastAPI with SQLModel?

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| Request-scoped sessions | Create session per request, close after response | Simple, safe, automatic cleanup | Slightly more overhead per request |
| Connection pooling | Reuse connections across requests | Performance, lower latency | Requires careful cleanup |
| Background workers | Separate connection management | Scalability | Complexity, async complexity |

### Decision: SQLModel with request-scoped sessions using FastAPI dependency injection

**Rationale**:
- Matches SQLModel/SQLAlchemy best practices
- FastAPI's `get_db()` pattern ensures proper cleanup
- Connection pooling handled by SQLModel engine with configured pool size
- Works well with Neon Serverless PostgreSQL connection pooling

**Implementation**:
```python
# database.py
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)

def get_db():
    with Session(engine) as session:
        yield session
```

---

## Decision 4: User ID Type for JWT and Database

**Question**: Use UUID or string for user_id in JWT and database?

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| UUID | PostgreSQL UUID type, random unique IDs | Secure, collision-free, standard | Longer URLs, harder to debug |
| ULID | Sortable UUID alternative | Lexicographically sortable | Less common, requires conversion |
| Snowflake | Twitter-style distributed ID | Sortable, high performance | Complex implementation |

### Decision: UUID (PostgreSQL native)

**Rationale**:
- PostgreSQL's `gen_random_uuid()` is standard and efficient
- Neon PostgreSQL supports UUID natively
- Better Auth expects UUID for user identifiers
- Matches constitution's database schema specification

**Implementation**:
- User.id: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- JWT payload: `sub` claim contains UUID string
- API URLs: `/api/{user_id}/tasks` where user_id is UUID string

---

## Best Practices Applied

### FastAPI + SQLModel Patterns

1. **Use Pydantic models for validation, SQLModel for persistence**
   - Create separate schemas for request/response validation
   - SQLModel models handle database operations

2. **Dependency injection for database sessions**
   - `get_db()` dependency yields session, ensures cleanup
   - Use `Annotated` with `SessionDep` for type safety

3. **Exception handling with HTTPException**
   - Create custom exception handlers for consistent error format
   - Return structured error responses with code and message

### JWT Best Practices

1. **Short token expiration**: 24 hours (configurable via environment)
2. **Secure token storage**: HTTP-only cookies (handled by frontend)
3. **HTTPS only in production**: Enforce in deployment
4. **Algorithm verification**: Use HS256, verify algorithm matches

### Data Isolation Pattern

```python
async def get_tasks(
    user_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    session: Session = Depends(get_db)
) -> list[Task]:
    # CRITICAL: Verify token user matches URL user
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Safe to proceed - user can only access their own tasks
    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
    ).all()
    return tasks
```

---

## Technology Compatibility Notes

### Dependencies Version Compatibility

| Package | Minimum Version | Rationale |
|---------|----------------|-----------|
| fastapi | 0.115.0 | Latest stable with improved OpenAPI support |
| sqlmodel | 0.0.18 | Pydantic v2 integration |
| python-jose | 3.3.0 | JWT encoding/decoding |
| alembic | 1.13.0 | SQLModel migration support |
| psycopg2-binary | 2.9.9 | PostgreSQL driver |

### Neon PostgreSQL Specifics

- Use connection pooling: `?sslmode=require` in connection string
- Pool size: 10 connections with 20 overflow
- Timeout: 30 seconds for query execution
- The `DATABASE_URL` from `.env` is already configured with proper SSL

---

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Python-JOSE JWT Documentation](https://python-jose.readthedocs.io/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Neon Serverless PostgreSQL](https://neon.tech/docs)
- [Passlib Password Hashing](https://passlib.readthedocs.io/)
