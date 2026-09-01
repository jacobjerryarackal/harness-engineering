# ADR-0004: Verification Gates Before Completion

Status: Accepted

## Context

A fundamental flaw in naive AI coding assistants is relying on the model's self-declaration of completion ("I have finished the task and verified the code"). LLMs routinely claim that code compiles or tests pass without actually executing verification tools.

In mission-critical software systems, task completion must be backed by non-negotiable verification gates and persistent evidentiary proof.

## Decision

Symphony enforces four distinct, mandatory verification layers before marking an execution run successful:

1. **Policy Gate (`memory.policy_engine.PolicyEngineService`)**:
   Evaluates corporate and engineering constraints (e.g. security rules, linting policies) against active context before execution proceeds.
2. **Evaluation Gate (`harnesses.evaluation.EvaluationHarness`)**:
   Executes automated verification test suites and requires explicit boolean pass/fail status (`test_results["passed"] == True`).
3. **Hard Evidence Store (`memory.evidence_store.EvidenceStoreService`)**:
   Persists actual execution artifacts (generated files, test outputs, execution hashes) keyed by `run_id`.
4. **Runtime Telemetry Verification (`runtime.production.ProductionRuntime` & `runtime.telemetry.TelemetryCollector`)**:
   Runs deployment simulations and captures real exit codes and stdout logs. An exit code $\neq 0$ triggers automated incident logging in `memory.failure_repository.FailureRepository`.

## Alternatives Considered

1. **Trusting Model Self-Reported Success**:
   - *Rejected*: Leads to silent regressions and unverified runtime crashes.
2. **Post-Hoc Manual Human Verification Only**:
   - *Rejected*: Inefficient for automated workflows; automated verification gates should act as the first line of defense.

## Consequences

### Positive
- **Auditable Quality**: Completion is provable via stored evidence in `EvidenceStoreService` and telemetry logs.
- **Automated Incident Capture**: Any evaluation or runtime failure is automatically recorded in `FailureRepository`.
- **Enforced Compliance**: Policy rules are checked before code is released.

### Negative / Trade-offs
- Runs that fail evaluation gates halt the pipeline and return `success=False` with error artifacts, requiring user intervention or learning loop remediation.

## Implementation

- Policy Engine: [memory/policy_engine.py](../../memory/policy_engine.py)
- Evaluation Harness: [harnesses/evaluation.py](../../harnesses/evaluation.py)
- Evidence Store: [memory/evidence_store.py](../../memory/evidence_store.py)
- Failure Repository: [memory/failure_repository.py](../../memory/failure_repository.py)
- Production Runtime: [runtime/production.py](../../runtime/production.py)

## Related Documentation

- [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) (Section 3: Key Architectural Principles)
- [README.md](../../README.md) (Section 8: Verification & Evidence Store)
- [ADR-0007: Closed-Loop Runtime Learning](0007-closed-loop-runtime-learning.md)
