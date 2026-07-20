from typing import Dict, List
from core.interfaces import Domain
from harnesses.base import Harness

class HarnessRegistry:
    """Registry to maintain and look up available engineering harnesses."""

    def __init__(self) -> None:
        self._harnesses: Dict[Domain, Harness] = {}

    def register(self, harness: Harness) -> None:
        """Registers a harness for its specific engineering domain."""
        self._harnesses[harness.domain] = harness

    def get_harness(self, domain: Domain) -> Harness:
        """Retrieves the registered harness for the given domain."""
        if domain not in self._harnesses:
            raise KeyError(f"No harness registered for domain: {domain}")
        return self._harnesses[domain]

    def list_harnesses(self) -> List[Harness]:
        """Returns a list of all registered harnesses."""
        return list(self._harnesses.values())

    def clear_registry(self) -> None:
        """Clears all registered harnesses."""
        self._harnesses.clear()
