from typing import Any, Dict, List, Optional

class EvidenceStoreService:
    """Service to record hard evidence (tests, outputs, code artifacts, test logs) generated during development."""

    def __init__(self) -> None:
        self._evidence: List[Dict[str, Any]] = []

    def store_evidence(
        self,
        run_id: str,
        evidence_type: str,
        content: Any,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Stores evidence for a run ID with a type, content, and optional metadata."""
        meta = metadata if metadata is not None else {}
        self._evidence.append({
            "run_id": run_id,
            "type": evidence_type,
            "content": content,
            "metadata": meta
        })

    def get_evidence(self, run_id: str, evidence_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieves evidence for a specific run ID and optional evidence type."""
        results: List[Dict[str, Any]] = []
        for item in self._evidence:
            if item["run_id"] == run_id:
                if evidence_type is None or item["type"] == evidence_type:
                    results.append(item)
        return results

    def get_all_evidence(self) -> List[Dict[str, Any]]:
        """Retrieves all evidence in the store."""
        return list(self._evidence)

    def clear_evidence(self) -> None:
        """Clears all stored evidence."""
        self._evidence.clear()
