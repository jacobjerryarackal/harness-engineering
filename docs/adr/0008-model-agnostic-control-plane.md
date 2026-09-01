# ADR-0008: Model-Agnostic Control Plane Intent Routing

Status: Accepted

## Context

Many agentic frameworks rely on unstructured LLM "function calling" or prompt routing to decide what tasks to execute. This introduces significant latency, nondeterminism, and vulnerability to prompt injection or malformed tool outputs.

Symphony required a deterministic, high-throughput control plane capable of parsing engineering intent, mapping intents to required domains, and selecting active harnesses without requiring mandatory LLM inference calls at the routing layer.

## Decision

We separated Control Plane Orchestration (`core/`) into four modular, deterministic sub-components:

1. **`PatternIntentAnalyzer`** (`core.intent_analyzer.PatternIntentAnalyzer`):
   Parses raw intent strings via declarative keyword and pattern matching to identify required domains (`SPECIFICATION`, `RESEARCH`, `ARCHITECTURE`, `ENGINEERING`, `EVALUATION`, `DEPLOYMENT`, `LEARNING`).
2. **`DomainHarnessRouter`** (`core.harness_router.DomainHarnessRouter`):
   Maps intent domain requirements into canonical topological execution sequences.
3. **`RegistryHarnessSelector`** (`core.harness_selector.RegistryHarnessSelector`):
   Resolves required domains against the active `HarnessRegistry` instance.
4. **`SequentialExecutionPlanner`** (`core.execution_planner.SequentialExecutionPlanner`):
   Assembles discrete `ExecutionPlan` structures with typed `ExecutionStep` instances.

This ensures the control plane functions as a fast, robust operating system kernel coordinating specialized harnesses.

## Alternatives Considered

1. **LLM-Based Semantic Router**:
   - *Rejected*: Slower (hundreds of milliseconds per intent parse) and non-deterministic; pattern matching provides microsecond response times and 100% predictable domain resolution.
2. **Hardcoded Monolithic If-Else Routing**:
   - *Rejected*: Inflexible; abstract interfaces (`IntentAnalyzer`, `HarnessRouter`, `HarnessSelector`, `ExecutionPlanner`) allow swapping implementations via dependency injection.

## Consequences

### Positive
- **Sub-Millisecond Routing**: Intent analysis and plan formulation execute with near-zero latency.
- **Pluggable Architecture**: Concrete routers and planners can be replaced or enhanced via `core.orchestrator.SymphonyOrchestrator` constructor injection.
- **Deterministic Routing Tests**: All intent combinations are easily verified with deterministic unit tests.

### Negative / Trade-offs
- Pure pattern matching requires defining keyword heuristics in `PatternIntentAnalyzer` for new domains.

## Implementation

- Intent Analyzer: [core/intent_analyzer.py](../../core/intent_analyzer.py)
- Harness Router: [core/harness_router.py](../../core/harness_router.py)
- Harness Selector: [core/harness_selector.py](../../core/harness_selector.py)
- Execution Planner: [core/execution_planner.py](../../core/execution_planner.py)
- Orchestrator: [core/orchestrator.py](../../core/orchestrator.py)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 4 & 5: HLD and LLD Control Plane Pipelines)
- [README.md](../../README.md) (Section 4: Control Plane Architecture)
- [ADR-0001: Model-Agnostic Harness Architecture](0001-model-agnostic-harness-architecture.md)
- [ADR-0003: Deterministic DAG Execution Planning](0003-deterministic-dag-execution.md)
