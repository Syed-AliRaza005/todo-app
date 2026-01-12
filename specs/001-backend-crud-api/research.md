# Research: Backend CRUD API

**Purpose**: Technical research and architecture decisions for backend CRUD API implementation
**Created**: 2026-01-01

## Technology Decisions

### Decision: FastAPI Framework
**Rationale**: Constitution Phase-2 specifies Python FastAPI as the backend framework. FastAPI provides automatic OpenAPI documentation, type validation via Pydantic, async support, and high performance.
**Alternatives Considered**:
- Flask: More traditional, requires additional libraries for API documentation and type validation
- Django: Batteries-included but heavier for simple CRUD operations
- Tornado: Lower-level, requires more boilerplate

### Decision: SQLModel ORM
**Rationale**: Constitution specifies SQLModel (built on Pydantic + SQLAlchemy). SQLModel provides automatic Pydantic models that work with FastAPI validation, eliminating model duplication between ORM and API layers.
**Alternatives Considered**:
- SQLAlchemy Direct: Requires separate Pydantic models for API validation
- Tortoise ORM: Less mature, smaller community
- Django ORM: Tied to Django framework, not compatible with FastAPI

### Decision: Neon Serverless PostgreSQL
**Rationale**: Constitution specifies Neon database. Neon provides serverless PostgreSQL with automatic scaling, connection pooling, and reduced operational overhead.
**Alternatives Considered**:
- Self-hosted PostgreSQL: Requires database management and scaling
- AWS RDS: Higher operational complexity and cost
- SQLite: Not suitable for multi-user concurrent access

### Decision: JWT Authentication
**Rationale**: Constitution Phase-2 requires JWT-based authentication for cross-platform compatibility. JWTs are stateless, scale horizontally, and work seamlessly with frontend Better Auth integration.
**Alternatives Considered**:
- Session-based auth: Requires server-side session storage, less suitable for serverless
- OAuth2: Adds unnecessary complexity for direct auth system
- API Keys: Less secure, cannot encode user context

### Decision: Alembic for Migrations
**Rationale**: Alembic is the standard migration tool for SQLAlchemy/SQLModel. Provides version control for schema changes, rollback capabilities, and collaborative team development.
**Alternatives Considered**:
- Manual SQL scripts: No version control, error-prone
- Flyway: Less Python-native, limited SQLAlchemy support
- No migrations: Risky for production database changes

## Architecture Patterns

### RESTful API Design
- **Pattern**: Resource-based URLs following REST conventions
- **Decision**: Use `/api/{user_id}/tasks` pattern for user data isolation
- **Rationale**: Explicit user_id in URL enables clear ownership enforcement and aligns with Constitution Principle VIII

### Error Handling Strategy
- **Pattern**: Global exception handlers returning consistent HTTP status codes
- **Decision**: Use FastAPI exception handlers for 401, 403, 404, 422 errors
- **Rationale**: Consistent error responses enable frontend error handling and meet FR-012 requirements

### Database Connection Management
- **Pattern**: Connection pooling with async support
- **Decision**: Use SQLModel's async engine with connection pooling
- **Rationale**: Handles concurrent requests efficiently (SC-003 requires 100 concurrent users)

## Dependencies Analysis

### python-jose (JWT)
- **Purpose**: JWT encoding/decoding
- **Usage**: Verify JWT tokens from Authorization header
- **Best Practice**: Use asymmetric signing for production, symmetric for development

### Pydantic v2
- **Purpose**: Data validation and serialization
- **Integration**: Native to FastAPI and SQLModel
- **Best Practice**: Use validators for input constraints (title length, required fields)

### pytest-asyncio
- **Purpose**: Async test execution
- **Usage**: Test async FastAPI endpoints
- **Best Practice**: Use pytest fixtures for database sessions

## Performance Considerations

### Database Indexing
- **Strategy**: Index `user_id` and `status` columns on tasks table
- **Rationale**: Supports SC-002 (200ms retrieval) by optimizing filtered queries

### Async Operations
- **Strategy**: Use async/await throughout API layer
- **Rationale**: Enables handling 100 concurrent users (SC-003) without blocking

### Connection Pooling
- **Strategy**: Configure SQLAlchemy engine with pool_size=20, max_overflow=40
- **Rationale**: Supports concurrent access while limiting database connections

## Security Considerations

### Data Isolation
- **Implementation**: Database foreign key constraint + application-level validation
- **Defense**: Two-layer security prevents cross-user data access
- **Compliance**: Meets Constitution Principle VIII requirements

### Token Validation
- **Implementation**: Verify token signature and expiration on every request
- **Implementation**: Extract user_id from JWT `sub` claim
- **Compliance**: Meets Constitution Principle VII requirements

## Summary

All technology decisions align with Phase-2 constitution requirements:
- FastAPI + SQLModel for backend framework and ORM
- Neon PostgreSQL for serverless database
- JWT authentication for stateless security
- Alembic for schema migrations
- RESTful API design for user data isolation
- Async architecture for concurrent user support
- Proper error handling and validation

No clarifications needed - all technical decisions specified in constitution and spec.
