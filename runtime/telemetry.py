import time
from typing import Any, Dict

class TelemetryCollector:
    """Collects and structures telemetry logs and metrics from production runtimes."""

    def collect_telemetry(self, run_id: str, runtime_output: Dict[str, Any]) -> Dict[str, Any]:
        """Formats telemetry data for downstream parsing."""
        return {
            "run_id": run_id,
            "status": runtime_output.get("status", "UNKNOWN"),
            "exit_code": runtime_output.get("exit_code", -1),
            "logs": runtime_output.get("logs", []),
            "metrics": runtime_output.get("metrics", {}),
            "timestamp": runtime_output.get("timestamp", time.time())
        }

