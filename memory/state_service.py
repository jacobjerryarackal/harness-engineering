from typing import Any, Dict

class StateService:
    """Service to track workspace and application state variables."""

    def __init__(self) -> None:
        self._states: Dict[str, Any] = {}

    def set_state(self, key: str, value: Any) -> None:
        """Sets a state variable value."""
        self._states[key] = value

    def get_state(self, key: str, default: Any = None) -> Any:
        """Retrieves a state variable value, returning default if not found."""
        return self._states.get(key, default)

    def get_all_states(self) -> Dict[str, Any]:
        """Retrieves a dictionary copy of all state variables."""
        return dict(self._states)

    def clear_state(self) -> None:
        """Clears all stored state variables."""
        self._states.clear()
