from typing import Any, Dict, List, Optional, Tuple

Triple = Tuple[str, str, str, Dict[str, Any]]

class KnowledgeGraphService:
    """Service to store and query semantically linked facts in a Knowledge Graph."""

    def __init__(self) -> None:
        self._triples: List[Triple] = []

    def add_triple(self, subject: str, predicate: str, obj: str, metadata: Optional[Dict[str, Any]] = None) -> None:
        """Adds a subject-predicate-object triple with optional metadata."""
        meta = metadata if metadata is not None else {}
        self._triples.append((subject, predicate, obj, meta))

    def query_triples(
        self,
        subject: Optional[str] = None,
        predicate: Optional[str] = None,
        obj: Optional[str] = None
    ) -> List[Triple]:
        """Queries stored triples matching subject, predicate, and/or object criteria."""
        results: List[Triple] = []
        for s, p, o, meta in self._triples:
            if subject is not None and s != subject:
                continue
            if predicate is not None and p != predicate:
                continue
            if obj is not None and o != obj:
                continue
            results.append((s, p, o, meta))
        return results

    def get_all_triples(self) -> List[Triple]:
        """Retrieves all triples in the graph."""
        return list(self._triples)

    def clear_graph(self) -> None:
        """Clears all triples in the graph."""
        self._triples.clear()
