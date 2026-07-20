from typing import Dict, List
from memory.memory_service import MemoryService
from memory.context_service import ContextService
from memory.state_service import StateService
from memory.knowledge_graph import KnowledgeGraphService
from memory.evidence_store import EvidenceStoreService
from memory.failure_repository import FailureRepository
from memory.policy_engine import PolicyEngineService

from harnesses.registry import HarnessRegistry
from harnesses.specification import SpecificationHarness
from harnesses.research import ResearchHarness
from harnesses.architecture import ArchitectureHarness
from harnesses.engineering import EngineeringHarness
from harnesses.evaluation import EvaluationHarness
from harnesses.deployment import DeploymentHarness
from harnesses.learning import LearningHarness

from core.intent_analyzer import PatternIntentAnalyzer
from core.harness_router import DomainHarnessRouter
from core.harness_selector import RegistryHarnessSelector
from core.execution_planner import SequentialExecutionPlanner
from core.context_manager import PlatformContextManager
from core.execution_engine import Engine
from core.response_aggregator import ArtifactAggregator
from core.orchestrator import SymphonyOrchestrator

from runtime.production import ProductionRuntime
from runtime.telemetry import TelemetryCollector
from runtime.knowledge_extraction import KnowledgeExtractor
from runtime.learning_engine import LearningEngine
from runtime.memory_update import MemoryUpdater

class Container:
    """Singleton dependency container providing shared services across API requests."""
    
    def __init__(self) -> None:
        # 1. Shared Core Services
        self.memory_service = MemoryService()
        self.context_service = ContextService()
        self.state_service = StateService()
        self.knowledge_graph = KnowledgeGraphService()
        self.evidence_store = EvidenceStoreService()
        self.failure_repository = FailureRepository()
        self.policy_engine = PolicyEngineService()

        # 2. Harness Registry setup
        self.harness_registry = HarnessRegistry()
        self.harness_registry.register(SpecificationHarness())
        self.harness_registry.register(ResearchHarness())
        self.harness_registry.register(ArchitectureHarness())
        self.harness_registry.register(EngineeringHarness())
        self.harness_registry.register(EvaluationHarness())
        self.harness_registry.register(DeploymentHarness())
        self.harness_registry.register(LearningHarness())

        # 3. Control Plane Orchestrator setup
        self.context_manager = PlatformContextManager(
            context_service=self.context_service,
            state_service=self.state_service,
            policy_engine=self.policy_engine,
            knowledge_graph=self.knowledge_graph
        )
        self.execution_engine = Engine(
            memory_service=self.memory_service,
            failure_repo=self.failure_repository
        )
        
        self.orchestrator = SymphonyOrchestrator(
            intent_analyzer=PatternIntentAnalyzer(),
            harness_router=DomainHarnessRouter(),
            harness_selector=RegistryHarnessSelector(),
            execution_planner=SequentialExecutionPlanner(),
            context_manager=self.context_manager,
            execution_engine=self.execution_engine,
            response_aggregator=ArtifactAggregator(),
            harness_registry=self.harness_registry
        )

        # 4. Runtime & Feedback Loop
        self.production_runtime = ProductionRuntime()
        self.telemetry_collector = TelemetryCollector()
        self.knowledge_extractor = KnowledgeExtractor()
        self.learning_engine = LearningEngine()
        self.memory_updater = MemoryUpdater()
        
        # Track telemetry history across runs
        self.telemetry_history: List[Dict] = []

# Global container instance
container = Container()

def get_container() -> Container:
    """FastAPI Dependency Provider for the Container."""
    return container
