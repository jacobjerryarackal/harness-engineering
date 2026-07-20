from abc import ABC, abstractmethod
from typing import Any, Dict
from core.interfaces import Domain, ExecutionContext, HarnessResult

class Harness(ABC):
    """Abstract base class representing a specialized engineering harness."""

    @property
    @abstractmethod
    def domain(self) -> Domain:
        """Returns the engineering domain of this harness."""
        pass

    @abstractmethod
    def execute(self, context: ExecutionContext, parameters: Dict[str, Any]) -> HarnessResult:
        """Executes the harness logic within the given execution context and parameters."""
        pass
