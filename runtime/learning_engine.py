from typing import Any, Dict, List

class LearningEngine:
    """Decides what knowledge, memory, or policy updates to make based on extracted telemetry events."""

    def generate_updates(self, extracted_events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Calculates update transactions for the shared memory layer."""
        updates: List[Dict[str, Any]] = []

        for event in extracted_events:
            run_id = event.get("run_id", "unknown")
            if event["type"] == "FAILURE_EVENT":
                error_msg = event.get("error_details", "Internal failure")
                
                # Update: Log the failure to the FailureRepository
                updates.append({
                    "action": "LOG_FAILURE",
                    "run_id": run_id,
                    "component": "ProductionRuntime",
                    "error_message": error_msg
                })
                
                # Update: Add a fact to the KnowledgeGraph mapping this run to a failure
                updates.append({
                    "action": "ADD_TRIPLE",
                    "subject": f"Run:{run_id}",
                    "predicate": "encountered_failure",
                    "obj": error_msg,
                    "metadata": {"type": "runtime_crash"}
                })
            
            elif event["type"] == "SUCCESS_EVENT":
                # Update: Add a fact to the KnowledgeGraph mapping this run to success
                updates.append({
                    "action": "ADD_TRIPLE",
                    "subject": f"Run:{run_id}",
                    "predicate": "deployed_successfully",
                    "obj": "StableStatus",
                    "metadata": {"type": "runtime_success"}
                })

        return updates
