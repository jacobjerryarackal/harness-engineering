from typing import Any, Callable, Dict, List, Optional

PolicyRule = Callable[[Dict[str, Any]], bool]

class PolicyEngineService:
    """Service to define and check engineering policies and compliance rules."""

    def __init__(self) -> None:
        self._policies: Dict[str, Dict[str, Any]] = {}
        self._rules: Dict[str, PolicyRule] = {}

    def add_policy(
        self,
        policy_id: str,
        description: str,
        rule: Optional[PolicyRule] = None
    ) -> None:
        """Adds a policy rule and description."""
        self._policies[policy_id] = {
            "policy_id": policy_id,
            "description": description,
        }
        if rule is not None:
            self._rules[policy_id] = rule

    def evaluate_policy(self, policy_id: str, context: Dict[str, Any]) -> bool:
        """Evaluates a policy against the provided context dictionary."""
        if policy_id not in self._policies:
            return True  # If policy doesn't exist, pass by default
        if policy_id in self._rules:
            return self._rules[policy_id](context)
        return True

    def get_all_policies(self) -> List[Dict[str, Any]]:
        """Returns all defined policies."""
        return list(self._policies.values())

    def clear_policies(self) -> None:
        """Clears all policies and rules."""
        self._policies.clear()
        self._rules.clear()
