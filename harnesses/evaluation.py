from typing import Any, Dict
from core.interfaces import Domain, ExecutionContext, HarnessResult
from harnesses.base import Harness

class EvaluationHarness(Harness):
    """Harness responsible for running tests and verifying code correctness."""

    @property
    def domain(self) -> Domain:
        return Domain.EVALUATION

    def execute(self, context: ExecutionContext, parameters: Dict[str, Any]) -> HarnessResult:
        logs = ["Starting Evaluation Harness execution."]
        
        # Check if tests should pass or fail
        force_fail = parameters.get("force_fail", False)
        
        success = not force_fail
        test_results = {
            "passed": success,
            "failed": 1 if force_fail else 0,
            "total_runs": 1,
            "details": "AssertionError" if force_fail else "All tests passed successfully."
        }
        
        outputs = {
            "test_results": test_results
        }
        
        if success:
            logs.append("Evaluated successfully. Mocks tests passed.")
        else:
            logs.append("Evaluated failures. Mocks tests failed.")
            
        updated_variables = {"evaluation_success": success}
        updated_state = {"last_active_phase": "EVALUATION"}
        
        return HarnessResult(
            success=success,
            outputs=outputs,
            logs=logs,
            error_message="Test failures encountered" if not success else None,
            updated_variables=updated_variables,
            updated_state=updated_state
        )
