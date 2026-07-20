import time
from typing import Any, Dict, List, Optional

class FailureRepository:
    """Service to persist and query execution failures and errors."""

    def __init__(self) -> None:
        self._failures: List[Dict[str, Any]] = []

    def log_failure(
        self,
        run_id: str,
        component: str,
        error_message: str,
        stack_trace: Optional[str] = None
    ) -> None:
        """Logs a failure incident for a given component and run ID."""
        self._failures.append({
            "run_id": run_id,
            "component": component,
            "error_message": error_message,
            "stack_trace": stack_trace,
            "timestamp": time.time()
        })

    def get_failures(self, run_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieves failures, optionally filtered by run ID."""
        if run_id is None:
            return list(self._failures)
        return [f for f in self._failures if f["run_id"] == run_id]

    def clear_failures(self) -> None:
        """Clears all stored failure logs."""
        self._failures.clear()
