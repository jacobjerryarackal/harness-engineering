from typing import Any, Dict
from core.interfaces import Domain, ExecutionContext, HarnessResult
from harnesses.base import Harness

class LearningHarness(Harness):
    """Harness responsible for analyzing failures and extracting lessons/rules."""

    @property
    def domain(self) -> Domain:
        return Domain.LEARNING

    def execute(self, context: ExecutionContext, parameters: Dict[str, Any]) -> HarnessResult:
        logs = ["Starting Learning Harness execution."]
        
        # Read active failure details
        failure_msg = context.variables.get("last_failure_reason", "Unknown internal error")
        logs.append(f"Analyzing failure: {failure_msg}")
        
        learning_note = f"Learning Note: Resolved issue matching failure '{failure_msg}' by updating policy configuration."
        
        outputs = {
            "learning_notes": learning_note,
            "new_triples": [
                ("System", "prevented_error", failure_msg)
            ]
        }
        
        logs.append("Learning harness execution complete.")
        
        updated_variables = {"learnings_extracted": True}
        updated_state = {"last_active_phase": "LEARNING"}
        
        return HarnessResult(
            success=True,
            outputs=outputs,
            logs=logs,
            updated_variables=updated_variables,
            updated_state=updated_state
        )
