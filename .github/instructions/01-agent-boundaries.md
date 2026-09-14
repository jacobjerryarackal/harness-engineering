# Agent Boundary & Scope Constraints

## Objective
Enforce strict filesystem and architectural invariants on autonomous coding agents to eliminate hallucinated scope expansion and unintended package drift.

## Invariant Rules

1. **Protected Core Interfaces (`core/interfaces.py`)**:
   - Coding agents must treat dataclasses, protocols, and abstract interfaces in `core/interfaces.py` as **read-only immutable contracts**.
   - Any interface mutation requires an explicit Architecture Decision Record (ADR) and human approval.

2. **Dependency Immutability (`requirements.txt`, lockfiles)**:
   - Agents are forbidden from adding, modifying, or removing external dependencies unless explicitly instructed by a dependency upgrade prompt.
   - Unpinned dependency additions or spontaneous library installations are flagged as critical harness violations.

3. **Workspace Isolation & Blast Radius Control**:
   - An agent tasked with modifying `app/routers/` may only write to files under `app/routers/` and corresponding unit tests in `tests/test_api.py`.
   - Modifying runtime state services (`memory/`), domain harnesses (`harnesses/`), or root configuration (`pytest.ini`) without explicit scope grants halts execution deterministically.
