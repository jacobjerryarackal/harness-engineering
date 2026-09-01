# ADR-0003: Deterministic DAG Execution Planning

Status: Accepted

## Context

Free-form multi-agent conversations and autonomous ReAct loops frequently suffer from infinite loops, non-deterministic execution paths, and unpredictable ordering of operations (e.g. attempting to run tests before code is written, or deploying before verification). 

Production engineering systems require deterministic ordering, predictable failure recovery, and unambiguous dependency propagation.

## Decision

We implemented a deterministic execution pipeline orchestrated by three cooperating components:

1. **`DomainHarnessRouter`** (`core.harness_router.DomainHarnessRouter`):
   Enforces a strict canonical topological sort order across engineering domains:
   $$\text{SPECIFICATION} \rightarrow \text{RESEARCH} \rightarrow \text{ARCHITECTURE} \rightarrow \text{ENGINEERING} \rightarrow \text{EVALUATION} \rightarrow \text{DEPLOYMENT} \rightarrow \text{LEARNING}$$
2. **`SequentialExecutionPlanner`** (`core.execution_planner.SequentialExecutionPlanner`):
   Generates a discrete, numbered `ExecutionPlan` containing `ExecutionStep` instances with explicit identifiers (e.g. `step_1_specification`, `step_2_engineering`).
3. **`Engine`** (`core.execution_engine.Engine`):
   Executes plan steps sequentially, propagates context mutations, logs execution traces to `MemoryService`, and halts immediately upon encountering a step failure, logging the incident to `FailureRepository`.

## Alternatives Considered

1. **Dynamic LLM-Decided Next Step (ReAct loop)**:
   - *Rejected*: Prone to hallucinating non-existent tools, repeating failed actions, and skipping essential evaluation phases.
2. **Parallel Async Graph Engine (e.g. Celery / Ray / Airflow)**:
   - *Rejected*: In local/single-run control plane orchestration, pipeline stages have strict data dependencies (code depends on spec; evaluation depends on code). Sequential execution guarantees exact state propagation without race conditions.

## Consequences

### Positive
- **Reproducibility**: Identical intents always yield identical execution step topologies.
- **Fail-Fast Safety**: If specification or engineering fails, downstream evaluation and deployment steps are immediately blocked.
- **Observability**: Step progress can be rendered node-by-node on the frontend visualizer.

### Negative / Trade-offs
- Steps are executed sequentially; independent multi-module generation currently executes in ordered sequence rather than parallel threads.

## Implementation

- Harness Router: [core/harness_router.py](../../core/harness_router.py)
- Execution Planner: [core/execution_planner.py](../../core/execution_planner.py)
- Execution Engine: [core/execution_engine.py](../../core/execution_engine.py)
- Unit Tests: [tests/test_orchestrator.py](../../tests/test_orchestrator.py)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 5: Low-Level Design Pipeline Execution Flow)
- [README.md](../../README.md) (Section 4: Control Plane Architecture)
- [LLD Diagram](../architecture/lld.png)
