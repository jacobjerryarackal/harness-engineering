from abc import ABC, abstractmethod
from typing import Any, List
from core.interfaces import Domain
from harnesses.base import Harness

# Forward declaration of HarnessRegistry to avoid circular import issues
class HarnessRegistryLike(ABC):
    @abstractmethod
    def get_harness(self, domain: Domain) -> Harness:
        pass

class HarnessSelector(ABC):
    """Interface to select harnesses matching the required domains."""

    @abstractmethod
    def select_harnesses(self, required_domains: List[Domain], registry: Any) -> List[Harness]:
        """Selects harnesses from the registry matching the required domains."""
        pass

class RegistryHarnessSelector(HarnessSelector):
    """Concrete selector querying the HarnessRegistry to obtain matching harnesses."""

    def select_harnesses(self, required_domains: List[Domain], registry: Any) -> List[Harness]:
        """Queries registry for each domain, collecting active harnesses."""
        selected: List[Harness] = []
        for domain in required_domains:
            try:
                selected.append(registry.get_harness(domain))
            except KeyError:
                # If a harness isn't registered, we skip or handle gracefully in mock mode
                pass
        return selected
