from abc import ABC, abstractmethod
from typing import Any, List
from core.interfaces import Domain

class HarnessSelector(ABC):
    """Interface to select harnesses matching the required domains."""

    @abstractmethod
    def select_harnesses(self, required_domains: List[Domain], registry: Any) -> List[Any]:
        """Selects harnesses from the registry matching the required domains."""
        pass

class RegistryHarnessSelector(HarnessSelector):
    """Concrete selector querying the HarnessRegistry to obtain matching harnesses."""

    def select_harnesses(self, required_domains: List[Domain], registry: Any) -> List[Any]:
        """Queries registry for each domain, collecting active harnesses."""
        from harnesses.base import Harness
        selected: List[Harness] = []
        for domain in required_domains:
            try:
                selected.append(registry.get_harness(domain))
            except KeyError:
                # If a harness isn't registered, we skip or handle gracefully in mock mode
                pass
        return selected
