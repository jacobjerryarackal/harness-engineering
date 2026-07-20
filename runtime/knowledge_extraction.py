from typing import Any, Dict, List

class KnowledgeExtractor:
    """Parses telemetry output to identify structured facts, errors, and operational patterns."""

    def extract_knowledge(self, telemetry_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parses telemetry data and extracts event structures for the Learning Engine."""
        extracted_events: List[Dict[str, Any]] = []
        run_id = telemetry_data.get("run_id", "unknown")
        status = telemetry_data.get("status")
        logs = telemetry_data.get("logs", [])

        if status in ("CRASHED", "FAILED"):
            # Identify specific error lines in the logs
            error_details = [log for log in logs if "Exception" in log or "failure" in log or "Error" in log]
            extracted_events.append({
                "type": "FAILURE_EVENT",
                "run_id": run_id,
                "status": status,
                "error_details": "; ".join(error_details) if error_details else "Unspecified production failure"
            })
        elif status == "RUNNING":
            extracted_events.append({
                "type": "SUCCESS_EVENT",
                "run_id": run_id,
                "details": "Production deployment running stable."
            })

        return extracted_events
