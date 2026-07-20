import logging
from typing import Dict, List

class MemoryService:
    """Service to store and retrieve execution logs and system traces."""

    def __init__(self) -> None:
        self._traces: Dict[str, List[str]] = {}
        self._logger = logging.getLogger(self.__class__.__name__)

    def log_trace(self, run_id: str, message: str) -> None:
        """Logs an execution trace message for a given run ID."""
        if run_id not in self._traces:
            self._traces[run_id] = []
        self._traces[run_id].append(message)
        self._logger.debug(f"[Run: {run_id}] {message}")

    def get_traces(self, run_id: str) -> List[str]:
        """Retrieves all execution traces logged for a given run ID."""
        return self._traces.get(run_id, [])

    def get_all_traces(self) -> Dict[str, List[str]]:
        """Retrieves all stored execution traces across all run IDs."""
        return dict(self._traces)

    def clear_traces(self, run_id: str) -> None:
        """Clears execution traces for a given run ID."""
        if run_id in self._traces:
            del self._traces[run_id]

