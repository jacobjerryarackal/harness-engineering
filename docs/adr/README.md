# Architecture Decision Records (ADRs)

This directory contains the formal **Architecture Decision Records (ADRs)** for the **Symphony Autonomous Harness Operating System**.

- **High-Level Design (HLD)** ([docs/architecture/hld.png](../architecture/hld.png)) provides the structural topology and platform layering.
- **Low-Level Design (LLD)** ([docs/architecture/lld.png](../architecture/lld.png)) documents component-level pipeline interactions.
- **System Design Document** ([SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md)) and [README.md](../../README.md) define the comprehensive functional specifications.
- **ADRs** capture the context, rationale, alternatives considered, and trade-offs for key architectural choices across the codebase.

---

## ADR Index

| ADR | Title | Status | Date |
| :--- | :--- | :--- | :--- |
| [ADR-0001](0001-model-agnostic-harness-architecture.md) | Model-Agnostic Harness Architecture | Accepted | 2026-09-01 |
| [ADR-0002](0002-domain-specific-harnesses.md) | Domain-Specific Engineering Harnesses | Accepted | 2026-09-01 |
| [ADR-0003](0003-deterministic-dag-execution.md) | Deterministic DAG Execution Planning | Accepted | 2026-09-01 |
| [ADR-0004](0004-verification-gates-before-completion.md) | Verification Gates Before Completion | Accepted | 2026-09-01 |
| [ADR-0005](0005-separate-context-workspace-state-traces.md) | Separate Context, Workspace State, and Execution Traces | Accepted | 2026-09-01 |
| [ADR-0006](0006-persistent-context-lifecycle.md) | Persistent Context Lifecycle Boundary | Accepted | 2026-09-01 |
| [ADR-0007](0007-closed-loop-runtime-learning.md) | Closed-Loop Runtime Learning from Telemetry | Accepted | 2026-09-01 |
| [ADR-0008](0008-model-agnostic-control-plane.md) | Model-Agnostic Control Plane Intent Routing | Accepted | 2026-09-01 |
| [ADR-0009](0009-react-flow-runtime-visualization.md) | React Flow Runtime Control Plane Visualization | Accepted | 2026-09-01 |
| [ADR-0010](0010-persistent-workspace-state.md) | Persistent Workspace State Across Runs | Accepted | 2026-09-01 |
