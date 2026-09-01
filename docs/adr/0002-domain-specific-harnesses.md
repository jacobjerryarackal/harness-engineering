# ADR-0002: Domain-Specific Engineering Harnesses

Status: Accepted

## Context

Monolithic AI agents attempt to handle specification, research, system architecture, file writing, test verification, deployment, and post-mortem learning in a single unstructured prompt context. This leads to context window pollution, hallucinations, missed requirements, and unverified code generation.

Engineering workflows naturally divide into distinct functional domains, each requiring specific constraints, input parameters, and output artifacts.

## Decision

We decomposed the engineering lifecycle into seven specialized domain harnesses inheriting from `harnesses.base.Harness`:

1. **`SpecificationHarness`** (`Domain.SPECIFICATION`): Generates structured requirements and acceptance criteria (`spec.md`).
2. **`ResearchHarness`** (`Domain.RESEARCH`): Evaluates library dependencies and technical patterns.
3. **`ArchitectureHarness`** (`Domain.ARCHITECTURE`): Produces component layouts and system blueprints (`architecture_blueprint.md`).
4. **`EngineeringHarness`** (`Domain.ENGINEERING`): Generates application source code and implementation modules (`output.py`).
5. **`EvaluationHarness`** (`Domain.EVALUATION`): Runs verification test suites and measures compliance.
6. **`DeploymentHarness`** (`Domain.DEPLOYMENT`): Packages release configurations and runtime manifests.
7. **`LearningHarness`** (`Domain.LEARNING`): Analyzes failure post-mortems and extracts learning updates.

The `HarnessRegistry` (`harnesses.registry.HarnessRegistry`) dynamically registers and resolves these domain implementations.

## Alternatives Considered

1. **Single Monolithic Coding Agent**:
   - *Rejected*: Lacks clear phase boundaries, cannot enforce isolated failure states, and mixes architectural decisions with low-level implementation.
2. **Ad-Hoc Script Collection**:
   - *Rejected*: Fails to provide uniform contracts for context injection and aggregated response reporting.

## Consequences

### Positive
- **Single Responsibility Principle (SRP)**: Each harness focuses strictly on its domain outputs.
- **Selective Execution**: The control plane dynamically routes intents to only the harnesses required for a given task (e.g. `ResearchHarness` is skipped when researching is not requested).
- **Domain-Specific Verification**: Evaluation and learning have dedicated execution and failure boundaries.

### Negative / Trade-offs
- Adding a new engineering capability requires implementing a new harness class and registering it in the registry.
- Cross-harness data exchange must occur via `ExecutionContext.variables` rather than in-memory object passing.

## Implementation

- Base Harness: [harnesses/base.py](../../harnesses/base.py)
- Domain Implementations:
  - [harnesses/specification.py](../../harnesses/specification.py)
  - [harnesses/research.py](../../harnesses/research.py)
  - [harnesses/architecture.py](../../harnesses/architecture.py)
  - [harnesses/engineering.py](../../harnesses/engineering.py)
  - [harnesses/evaluation.py](../../harnesses/evaluation.py)
  - [harnesses/deployment.py](../../harnesses/deployment.py)
  - [harnesses/learning.py](../../harnesses/learning.py)
- Registry: [harnesses/registry.py](../../harnesses/registry.py)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 7: Harness Layer & Registry System)
- [README.md](../../README.md) (Section 5: Specialized Engineering Harnesses)
- [ADR-0001: Model-Agnostic Harness Architecture](0001-model-agnostic-harness-architecture.md)
