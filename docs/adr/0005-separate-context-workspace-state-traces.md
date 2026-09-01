# ADR-0005: Separate Context, Workspace State, and Execution Traces

Status: Accepted

## Context

A frequent anti-pattern in agent frameworks is using a single undifferentiated "memory" bucket for storing chat history, temporary variables, workspace status, and step logs. This conflation causes severe architectural problems:
- Ephemeral execution step logs pollute session variables.
- Project-level workspace state (e.g. current build status, active architectural phase) gets wiped out or mixed with transient request parameters.
- Querying and visualizing distinct memory aspects in developer tooling becomes ambiguous.

## Decision

We cleanly separated platform memory into three distinct, single-responsibility services within the `memory/` module:

1. **`ContextService` (`memory.context_service.ContextService`)**:
   - *Purpose*: Stores session context variables shared across harnesses (e.g. `request_text`, `specification_generated`, `code_written`, `evaluation_success`).
   - *Scope*: Active session / execution parameters.
2. **`StateService` (`memory.state_service.StateService`)**:
   - *Purpose*: Tracks persistent workspace and project component state across runs (e.g. `last_active_phase`, system build records).
   - *Scope*: Long-lived project workspace state.
3. **`MemoryService` (`memory.memory_service.MemoryService`)**:
   - *Purpose*: Captures chronological, step-by-step diagnostic execution traces and log lines keyed strictly by `run_id`.
   - *Scope*: Audit and debugging trace logs.

The API exposes these independently in `MemoryResponse` (`app/schemas/schemas.py`) and the frontend visualizes them in dedicated panels in `MemoryView.tsx`.

## Alternatives Considered

1. **Monolithic Key-Value Store**:
   - *Rejected*: Makes it impossible to clear temporary session variables without losing persistent workspace state or audit traces.
2. **Flat Chat History Array**:
   - *Rejected*: Inadequate for structured engineering state; fails to support typed state queries.

## Consequences

### Positive
- **Clear Lifecycles**: Session variables, workspace state, and execution traces can be mutated, queried, and cleared independently.
- **Frontend Clarity**: The developer UI displays distinct cards for Session Context, Workspace State, and Memory Traces with independent record counters.
- **Selective Injection**: Context managers inject only relevant variables and state into execution contexts rather than full log dumps.

### Negative / Trade-offs
- The API schema (`MemoryResponse`) and frontend client must maintain three distinct fields (`context_variables`, `project_state`, `traces`).

## Implementation

- Context Service: [memory/context_service.py](../../memory/context_service.py)
- State Service: [memory/state_service.py](../../memory/state_service.py)
- Memory Service: [memory/memory_service.py](../../memory/memory_service.py)
- API Router: [app/routers/memory.py](../../app/routers/memory.py)
- Frontend Component: [frontend/src/components/MemoryView.tsx](../../frontend/src/components/MemoryView.tsx)
- Unit Tests: [tests/test_memory.py](../../tests/test_memory.py)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 6: Shared Core Services Architecture)
- [README.md](../../README.md) (Section 6: Shared Core Services)
- [ADR-0006: Persistent Context Lifecycle Boundary](0006-persistent-context-lifecycle.md)
- [ADR-0010: Persistent Workspace State Across Runs](0010-persistent-workspace-state.md)
