# ADR-0006: Persistent Context Lifecycle Boundary

Status: Accepted

## Context

During early development, execution context assembly was decoupled from memory mutation:
1. `PlatformContextManager.prepare_context(run_id)` hydrated an `ExecutionContext` with variables and states.
2. The orchestrator ran the plan, updating `context.variables` and `context.state` on the ephemeral in-memory dataclass.
3. However, upon plan completion, mutated variables were never committed back to `ContextService` and `StateService`.

This caused a critical defect where `GET /memory` returned empty dictionaries (`0 Keys`, `0 Variables`) despite successful harness execution.

An architectural boundary had to be established: should individual harnesses directly mutate shared database/service instances during execution, or should context persistence be managed at the orchestrator/context-manager boundary?

## Decision

We decided that **harnesses must remain pure functions over their input context** and must never hold references to or directly mutate shared storage services. Instead, the context lifecycle is managed strictly at the control plane boundary by `ContextManager` and `SymphonyOrchestrator`:

```text
prepare_context(run_id)
        │
        ▼ (hydrates from ContextService + StateService)
  ExecutionContext
        │
        ▼
Harness Execution (mutates ephemeral context.variables & context.state)
        │
        ▼
persist_context(context)
        │
        ▼ (commits to ContextService.set_variable & StateService.set_state)
Shared Core Memory Persisted
```

We formally extended the `ContextManager` abstract base class with:
```python
@abstractmethod
def persist_context(self, context: ExecutionContext) -> None:
    """Persists updated execution context variables and workspace state to shared services."""
    pass
```

`SymphonyOrchestrator.run()` automatically invokes `self.context_manager.persist_context(context)` immediately following plan execution.

## Alternatives Considered

1. **Direct Service Injection into Every Harness**:
   - *Rejected*: Violates isolation; allows individual harnesses to execute arbitrary side-effect mutations on shared memory, making rollback and isolation impossible.
2. **Post-Mortem Runtime Scraper**:
   - *Rejected*: Fragile and indirect; context updates belong directly to the control plane orchestration lifecycle.

## Consequences

### Positive
- **Guaranteed State Persistence**: Every execution run reliably commits its output flags (e.g. `specification_generated`, `code_written`, `evaluation_success`, `last_active_phase`) to platform memory.
- **Pure Harness Isolation**: Harnesses remain simple, stateless, and testable with mock `ExecutionContext` objects.
- **Deterministic Synchronization**: Session context and workspace states are consistently updated in `ContextService` and `StateService`.

### Negative / Trade-offs
- Context mutations are batched and persisted at the end of engine execution rather than committed transactionally per individual step.

## Implementation

- Context Manager Interface & Implementation: [core/context_manager.py](../../core/context_manager.py)
- Control Plane Lifecycle: [core/orchestrator.py](../../core/orchestrator.py)
- Regression Unit Test: `test_orchestrator_persists_context_and_state` in [tests/test_orchestrator.py](../../tests/test_orchestrator.py)
- Integration API Test: `test_memory_endpoint` in [tests/test_api.py](../../tests/test_api.py)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 5: Low-Level Design & Section 6: Shared Core Services)
- [ADR-0005: Separate Context, Workspace State, and Execution Traces](0005-separate-context-workspace-state-traces.md)
- [ADR-0010: Persistent Workspace State Across Runs](0010-persistent-workspace-state.md)
