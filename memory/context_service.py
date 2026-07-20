from typing import Any, Dict

class ContextService:
    """Service to manage active session context variables."""

    def __init__(self) -> None:
        self._variables: Dict[str, Any] = {}

    def set_variable(self, key: str, value: Any) -> None:
        """Sets a context variable key to a specific value."""
        self._variables[key] = value

    def get_variable(self, key: str, default: Any = None) -> Any:
        """Retrieves a context variable value, returning default if not found."""
        return self._variables.get(key, default)

    def get_all_variables(self) -> Dict[str, Any]:
        """Retrieves all stored context variables."""
        return dict(self._variables)

    def clear_context(self) -> None:
        """Clears all session variables."""
        self._variables.clear()
