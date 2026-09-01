# ADR-0009: React Flow Runtime Control Plane Visualization

Status: Accepted

## Context

Complex multi-harness orchestration pipelines are notoriously opaque when represented solely as terminal text or streaming JSON dumps. Developers and engineering leaders need immediate visual intuition regarding:
- Which harnesses are selected for a given engineering intent.
- Topological execution dependencies between planning, architecture, engineering, evaluation, and runtime feedback.
- Real-time step status (idle, running, completed, failed).

## Decision

We integrated `@xyflow/react` (React Flow) in the Next.js frontend (`frontend/src/components/RealtimeFlow.tsx`) to render an interactive, animated topological control-plane graph.

The visualizer:
1. Translates the backend orchestrator pipeline (Intent $\rightarrow$ Planner $\rightarrow$ Context Manager $\rightarrow$ Active Harnesses $\rightarrow$ Telemetry $\rightarrow$ Memory Update) into a directed acyclic node graph.
2. Dynamically highlights active harness nodes based on the intent's `selected_harnesses` response.
3. Provides animated stroke gradients, custom dark-mode node styling, and zoom/pan controls to inspect execution flow in real time.

## Alternatives Considered

1. **Static SVG / Image Diagrams**:
   - *Rejected*: Inflexible and cannot reflect dynamic runtime selections or execution states per intent.
2. **Text-Only Terminal Dashboard**:
   - *Rejected*: Poor user experience for non-technical stakeholders and complex multi-step pipelines.
3. **Mermaid.js Dynamic Rendering**:
   - *Rejected*: Lacks smooth drag, pan, zoom, interactive node selection, and reactive state animations.

## Consequences

### Positive
- **High Observability**: Users instantly see which harnesses were activated and how context flows between components.
- **Interactive UI**: Interactive viewport supports responsive zooming, panning, and background dot patterns.
- **Direct Alignment with Backend**: Visual nodes directly mirror the backend `core.interfaces.Domain` and `runtime` modules.

### Negative / Trade-offs
- Adds `@xyflow/react` dependency to the frontend bundle.

## Implementation

- Component: [frontend/src/components/RealtimeFlow.tsx](../../frontend/src/components/RealtimeFlow.tsx)
- Container Page: [frontend/src/components/ExecuteView.tsx](../../frontend/src/components/ExecuteView.tsx)
- Package Dependencies: [frontend/package.json](../../frontend/package.json)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 9: Frontend Architecture & Real-Time Visualization)
- [README.md](../../README.md) (Section 9: Next.js Frontend Visualizer)
- [ADR-0003: Deterministic DAG Execution Planning](0003-deterministic-dag-execution.md)
