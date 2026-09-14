# Agent Verification Protocol & Deterministic Gates

## Objective
Establish mandatory pre-commit verification gates. Agents are prohibited from declaring task completion without executing deterministic validation tools and obtaining an exit code of zero.

## Gate Sequence

1. **Static Analysis & Boundary Verification**:
   - Run `python scripts/enforce_harness.py --check-boundaries`.
   - Verifies zero diffs on protected paths and validates allowed edit scopes.

2. **Automated Test Execution**:
   - Run `pytest tests/` (or invoke `harnesses.evaluation.EvaluationHarness`).
   - 100% test pass rate required. Zero regressions tolerated.

3. **Evidence Persistence**:
   - Machine-verifiable outputs (diff hashes, test runner exit codes) must be persisted to the platform `EvidenceStoreService` or committed with the run trace.
   - Declarations like "I have visually verified the code" without an execution log are rejected by the pre-commit hook.
