from abc import ABC, abstractmethod
from typing import Optional
from core.interfaces import ExecutionContext
from memory.context_service import ContextService
from memory.state_service import StateService
from memory.policy_engine import PolicyEngineService
from memory.knowledge_graph import KnowledgeGraphService

class ContextManager(ABC):
    """Interface for preparing and building execution contexts."""

    @abstractmethod
    def prepare_context(self, run_id: str) -> ExecutionContext:
        """Assembles an ExecutionContext for the run from shared core services."""
        pass

class PlatformContextManager(ContextManager):
    """Concrete ContextManager assembling context from shared services."""

    def __init__(
        self,
        context_service: Optional[ContextService] = None,
        state_service: Optional[StateService] = None,
        policy_engine: Optional[PolicyEngineService] = None,
        knowledge_graph: Optional[KnowledgeGraphService] = None,
    ) -> None:
        self._context_service = context_service or ContextService()
        self._state_service = state_service or StateService()
        self._policy_engine = policy_engine or PolicyEngineService()
        self._knowledge_graph = knowledge_graph or KnowledgeGraphService()

    def prepare_context(self, run_id: str) -> ExecutionContext:
        """Retrieves session context, workspace state, policies, and knowledge graph data."""
        variables = self._context_service.get_all_variables()
        state = self._state_service.get_all_states()
        policies = self._policy_engine.get_all_policies()
        triples = self._knowledge_graph.get_all_triples()

        return ExecutionContext(
            run_id=run_id,
            variables=variables,
            state=state,
            policies=policies,
            knowledge_triples=triples
        )
