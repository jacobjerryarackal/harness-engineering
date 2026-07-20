from abc import ABC, abstractmethod
from typing import Dict, List
from core.interfaces import Domain, Intent

class IntentAnalyzer(ABC):
    """Abstract interface for extracting intent from requests."""

    @abstractmethod
    def analyze_intent(self, request_text: str) -> Intent:
        """Parses a request string into a structured Intent."""
        pass

class PatternIntentAnalyzer(IntentAnalyzer):
    """Concrete IntentAnalyzer implementing keyword/pattern routing."""

    def __init__(self) -> None:
        self._keyword_mapping: Dict[str, Domain] = {
            "spec": Domain.SPECIFICATION,
            "requirement": Domain.SPECIFICATION,
            "research": Domain.RESEARCH,
            "investigate": Domain.RESEARCH,
            "knowledge": Domain.RESEARCH,
            "architecture": Domain.ARCHITECTURE,
            "design": Domain.ARCHITECTURE,
            "write": Domain.ENGINEERING,
            "code": Domain.ENGINEERING,
            "engineering": Domain.ENGINEERING,
            "implement": Domain.ENGINEERING,
            "test": Domain.EVALUATION,
            "evaluate": Domain.EVALUATION,
            "verify": Domain.EVALUATION,
            "check": Domain.EVALUATION,
            "deploy": Domain.DEPLOYMENT,
            "release": Domain.DEPLOYMENT,
            "learn": Domain.LEARNING,
            "failure": Domain.LEARNING,
            "feedback": Domain.LEARNING,
        }

    def analyze_intent(self, request_text: str) -> Intent:
        """Parses user requests to determine intent type and required domains."""
        normalized = request_text.lower()
        required: List[Domain] = []

        # Find matching domains based on keyword patterns
        for keyword, domain in self._keyword_mapping.items():
            if keyword in normalized and domain not in required:
                required.append(domain)

        # Fallback to engineering domain if no domains matched
        if not required:
            required.append(Domain.ENGINEERING)

        intent_type = "ENGINEERING_TASK"
        if Domain.SPECIFICATION in required:
            intent_type = "SPECIFICATION_TASK"
        elif Domain.LEARNING in required:
            intent_type = "FEEDBACK_LOOP_TASK"

        return Intent(
            request_text=request_text,
            intent_type=intent_type,
            required_domains=required
        )
