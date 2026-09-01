# ADR-0010: Persistent Workspace State Across Runs

Status: Accepted

## Context

Software engineering tasks rarely occur in a single ephemeral execution. A typical workflow involves successive iterations: first writing specifications and architecture, then implementing code in a follow-up run, and finally running evaluations and deployments.

If workspace state (such as `last_active_phase`, target build configuration, or component status) is discarded between HTTP requests, subsequent runs must re-analyze the entire codebase from scratch, leading to repetitive reasoning and loss of project context.

## Decision

We introduced persistent workspace state management via `memory.state_service.StateService` coordinated through `core.context_manager.PlatformContextManager`:

```text
Run N (e.g. Specification & Architecture)
        │
        ▼
context.state["last_active_phase"] = "ARCHITECTURE"
        │
        ▼
PlatformContextManager.persist_context(context)
        │
        ▼
StateService (stores {"last_active_phase": "ARCHITECTURE"})
        │
        ▼
Run N+1 (e.g. Engineering & Evaluation)
        │
        ▼
PlatformContextManager.prepare_context(run_id_2)
        │ (hydrates ExecutionContext.state from StateService)
        ▼
ExecutionContext.state contains previous phase ("ARCHITECTURE")
```

`StateService` provides `set_state(key, value)`, `get_state(key, default)`, and `get_all_states()` to persist long-lived project state dictionaries.

## Alternatives Considered

1. **Stateless Ephemeral Runs**:
   - *Rejected*: Forces every run to start from tabula rasa; cannot track incremental multi-step project phases.
2. **File System Git Tag Polling**:
   - *Rejected*: High filesystem I/O overhead and complex state parsing for in-flight orchestration state.

## Consequences

### Positive
- **Incremental Project Evolution**: Successive runs inherit existing workspace state variables.
- **Shared State Across Harnesses**: All registered harnesses can read current workspace variables from `ExecutionContext.state`.
- **API & UI Visibility**: `GET /memory` directly exposes `project_state` to the frontend dashboard.

### Negative / Trade-offs
- In the default in-memory singleton container (`app.dependencies.Container`), state persists in application memory across requests; production multi-replica scaling requires a distributed backing store (e.g. Redis / PostgreSQL).

## Implementation

- State Service: [memory/state_service.py](../../memory/state_service.py)
- Context Assembly & Persistence: [core/context_manager.py](../../core/context_manager.py)
- In-Memory Container: [app/dependencies.py](../../app/dependencies.py)
- API Serialization: [app/schemas/schemas.py](../../app/schemas/schemas.py)
- Frontend Visualizer: [frontend/src/components/MemoryView.tsx](../../frontend/src/components/MemoryView.tsx)
- Unit Tests: [tests/test_memory.py](../../tests/test_memory.py)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 6: Shared Core Services Architecture)
- [README.md](../../README.md) (Section 6: Shared Core Services)
- [ADR-0005: Separate Context, Workspace State, and Execution Traces](0005-separate-context-workspace-state-traces.md)
- [ADR-0006: Persistent Context Lifecycle Boundary](0006-persistent-context-lifecycle.md)
