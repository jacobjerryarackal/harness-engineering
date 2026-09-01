# ADR-0007: Closed-Loop Runtime Learning from Telemetry

Status: Accepted

## Context

Most software generation platforms operate in an **open loop**: once code is generated or a task terminates, the system forgets the outcome. When runtime crashes, evaluation errors, or deployment exceptions occur, the same failures are repeatedly reproduced on subsequent runs.

Symphony operates on the foundational principle: **"Loss = Information."** Runtime executions, whether successful or failed, contain high-value operational signals that should improve organizational intelligence.

## Decision

We architected an asynchronous, closed-loop feedback pipeline in the `runtime/` layer that runs post-execution:

```text
[ ExecutionArtifacts ]
          │
          ▼
[ ProductionRuntime.run_deployment() ] ─── (Simulates deployment & execution)
          │
          ▼
[ TelemetryCollector.collect_telemetry() ] ── (Captures logs, exit codes, metrics)
          │
          ▼
[ KnowledgeExtractor.extract_knowledge() ] ── (Extracts SUCCESS_EVENT / FAILURE_EVENT)
          │
          ▼
[ LearningEngine.generate_updates() ] ─────── (Generates ADD_TRIPLE / LOG_FAILURE actions)
          │
          ▼
[ MemoryUpdater.apply_updates() ] ─────────── (Commits to KnowledgeGraph & FailureRepo)
          │
          ▼
[ Shared Core Services ] ──────────────────── (Enriches future orchestrator runs)
```

1. **`ProductionRuntime`** (`runtime.production.ProductionRuntime`): Simulates execution and environment interaction.
2. **`TelemetryCollector`** (`runtime.telemetry.TelemetryCollector`): Standardizes execution metrics and logs.
3. **`KnowledgeExtractor`** (`runtime.knowledge_extraction.KnowledgeExtractor`): Formulates structured domain events (`SUCCESS_EVENT`, `FAILURE_EVENT`).
4. **`LearningEngine`** (`runtime.learning_engine.LearningEngine`): Synthesizes RDF semantic triples (`subject, predicate, obj, metadata`) and failure logs.
5. **`MemoryUpdater`** (`runtime.memory_update.MemoryUpdater`): Writes triples to `KnowledgeGraphService` and incidents to `FailureRepository`.

## Alternatives Considered

1. **Open-Loop Generation (No Runtime Feedback)**:
   - *Rejected*: Misses failure patterns and cannot maintain an evolving knowledge graph.
2. **Manual Engineer Feedback Tagging**:
   - *Rejected*: High friction; automated telemetry extraction provides zero-latency continuous learning.

## Consequences

### Positive
- **Continuous Knowledge Graph Enrichment**: Every successful deployment generates semantic facts (e.g. `Run:run-xxx -> deployed_successfully -> StableStatus`) stored in `KnowledgeGraphService`.
- **Zero-Data-Loss Failures**: Execution errors are automatically captured with error messages in `FailureRepository`.
- **Persistent Intelligence**: Future runs hydrate knowledge graph triples during context preparation.

### Negative / Trade-offs
- Every execution incurs the slight overhead of running the feedback loop post-orchestration.

## Implementation

- Runtime Modules:
  - [runtime/production.py](../../runtime/production.py)
  - [runtime/telemetry.py](../../runtime/telemetry.py)
  - [runtime/knowledge_extraction.py](../../runtime/knowledge_extraction.py)
  - [runtime/learning_engine.py](../../runtime/learning_engine.py)
  - [runtime/memory_update.py](../../runtime/memory_update.py)
- API Integration: [app/routers/execute.py](../../app/routers/execute.py)
- Unit Tests: [tests/test_runtime.py](../../tests/test_runtime.py)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 8: Closed-Loop Production Feedback & Learning Loop)
- [README.md](../../README.md) (Section 7: Production Runtime & Feedback Loop)
- [ADR-0004: Verification Gates Before Completion](0004-verification-gates-before-completion.md)
