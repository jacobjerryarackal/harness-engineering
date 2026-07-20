from abc import ABC, abstractmethod
from typing import List
from core.interfaces import Domain, Intent

class HarnessRouter(ABC):
    """Abstract interface for routing intent to required engineering domains."""

    @abstractmethod
    def route_intent(self, intent: Intent) -> List[Domain]:
        """Determines which engineering domains are required for the intent."""
        pass

class DomainHarnessRouter(HarnessRouter):
    """Concrete router forwarding the identified domains, ensuring correct ordering."""

    def route_intent(self, intent: Intent) -> List[Domain]:
        """Routes intent to domains, ensuring dependencies are ordered correctly.
        For example, if Engineering is requested, Specification/Architecture should come first if also requested.
        """
        domains = list(intent.required_domains)
        
        # Maintain a canonical order of domains to represent a standard SWE pipeline:
        # SPECIFICATION -> RESEARCH -> ARCHITECTURE -> ENGINEERING -> EVALUATION -> DEPLOYMENT -> LEARNING
        canonical_order = [
            Domain.SPECIFICATION,
            Domain.RESEARCH,
            Domain.ARCHITECTURE,
            Domain.ENGINEERING,
            Domain.EVALUATION,
            Domain.DEPLOYMENT,
            Domain.LEARNING
        ]
        
        sorted_domains = [d for d in canonical_order if d in domains]
        
        # If the sorted list is empty, default to ENGINEERING
        if not sorted_domains:
            sorted_domains = [Domain.ENGINEERING]
            
        return sorted_domains
