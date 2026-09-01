# ADR-0001: Model-Agnostic Harness Architecture

Status: Accepted

## Context

Traditional AI coding assistants couple reasoning logic directly to proprietary Large Language Model (LLM) APIs and provider-specific prompt protocols. This tight coupling makes the codebase fragile to model deprecations, provider outages, and pricing shifts. Furthermore, embedding inference calls indiscriminately across components makes deterministic testing and reproducible regression benchmarking nearly impossible.

Symphony required an architecture where high-level engineering coordination is strictly decoupled from specific LLM providers and inference backends.

## Decision

We defined a uniform, model-agnostic contract for all engineering activities via the `Harness` abstract base class (`harnesses.base.Harness`).

Every harness must:
1. Declare its target `Domain` enum (`core.interfaces.Domain`).
2. Implement a standard `execute(context: ExecutionContext, parameters: Dict[str, Any]) -> HarnessResult` method.
3. Accept an explicit `ExecutionContext` and produce a typed `HarnessResult` containing `outputs`, `logs`, `updated_variables`, and `updated_state`.

All orchestration logic in the control plane (`core.orchestrator.SymphonyOrchestrator`) interacts only with this abstract interface via `harnesses.registry.HarnessRegistry`.

## Alternatives Considered

1. **Direct LLM Provider SDK Binding (e.g. OpenAI / Anthropic / Gemini SDKs per module)**:
   - *Rejected*: Creates vendor lock-in, increases mock complexity in tests, and violates clean hexagonal architecture boundaries.
2. **Generic Multi-Agent Frameworks (e.g. AutoGen / CrewAI / LangChain Agents)**:
   - *Rejected*: Injects heavy dependencies, non-deterministic conversation loops, and opaque state mutations that prevent strict control plane verification.

## Consequences

### Positive
- **Vendor Independence**: Harnesses can swap underlying model engines (or deterministic heuristic generators) without modifying the control plane.
- **Testability**: Pure deterministic unit tests can be written for orchestrator pipelines with 0 API dependencies.
- **Uniform Telemetry**: Every harness emits standard logs, output files, and execution flags in a predictable structure.

### Negative / Trade-offs
- Requires maintaining typed interface data classes (`ExecutionContext`, `HarnessResult`, `ExecutionArtifacts`) in `core.interfaces`.
- Parameter passing requires dictionary-based serialization across harness steps.

## Implementation

- Abstract Interface: [harnesses/base.py](../../harnesses/base.py)
- Data Contracts: [core/interfaces.py](../../core/interfaces.py)
- Dynamic Registry: [harnesses/registry.py](../../harnesses/registry.py)
- Unit Tests: [tests/test_harnesses.py](../../tests/test_harnesses.py)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 3: Key Architectural Principles)
- [README.md](../../README.md) (Section 3: Core Design Principles)
- [HLD Diagram](../architecture/hld.png)
