from typing import Any, Dict
from core.interfaces import Domain, ExecutionContext, HarnessResult
from harnesses.base import Harness

class SpecificationHarness(Harness):
    """Harness responsible for generating system requirements and specifications."""

    @property
    def domain(self) -> Domain:
        return Domain.SPECIFICATION

    def execute(self, context: ExecutionContext, parameters: Dict[str, Any]) -> HarnessResult:
        logs = ["Starting Specification Harness execution."]
        
        request = context.variables.get("request_text", "Default Task Request")
        spec_content = (
            f"# Specification Document\n\n"
            f"## Objective\n"
            f"Fulfill the following engineering goal:\n"
            f"> {request}\n\n"
            f"## Requirements\n"
            f"1. Must be modular and testable.\n"
            f"2. Must conform to engineering policies.\n"
            f"3. Must handle exceptions gracefully.\n"
        )
        
        outputs = {
            "generated_files": {
                "spec.md": spec_content
            }
        }
        
        logs.append("Created spec.md successfully.")
        
        # Output variables and state to update
        updated_variables = {"specification_generated": True}
        updated_state = {"last_active_phase": "SPECIFICATION"}
        
        return HarnessResult(
            success=True,
            outputs=outputs,
            logs=logs,
            updated_variables=updated_variables,
            updated_state=updated_state
        )
