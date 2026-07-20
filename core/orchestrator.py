import uuid
from typing import Optional
from core.interfaces import ExecutionArtifacts
from core.intent_analyzer import IntentAnalyzer, PatternIntentAnalyzer
from core.harness_router import HarnessRouter, DomainHarnessRouter
from core.harness_selector import HarnessSelector, RegistryHarnessSelector
from core.execution_planner import ExecutionPlanner, SequentialExecutionPlanner
from core.context_manager import ContextManager, PlatformContextManager
from core.execution_engine import ExecutionEngine, Engine
from core.response_aggregator import ResponseAggregator, ArtifactAggregator
from harnesses.registry import HarnessRegistry

class SymphonyOrchestrator:
    """Central control plane orchestrator for Symphony Harness OS."""

    def __init__(
        self,
        intent_analyzer: Optional[IntentAnalyzer] = None,
        harness_router: Optional[HarnessRouter] = None,
        harness_selector: Optional[HarnessSelector] = None,
        execution_planner: Optional[ExecutionPlanner] = None,
        context_manager: Optional[ContextManager] = None,
        execution_engine: Optional[ExecutionEngine] = None,
        response_aggregator: Optional[ResponseAggregator] = None,
        harness_registry: Optional[HarnessRegistry] = None,
    ) -> None:
        self.intent_analyzer = intent_analyzer or PatternIntentAnalyzer()
        self.harness_router = harness_router or DomainHarnessRouter()
        self.harness_selector = harness_selector or RegistryHarnessSelector()
        self.execution_planner = execution_planner or SequentialExecutionPlanner()
        self.context_manager = context_manager or PlatformContextManager()
        self.execution_engine = execution_engine or Engine()
        self.response_aggregator = response_aggregator or ArtifactAggregator()
        self.harness_registry = harness_registry or HarnessRegistry()

    def run(self, request_text: str, run_id: Optional[str] = None) -> ExecutionArtifacts:
        """Executes the full Symphony orchestration lifecycle for a request."""
        active_run_id = run_id or f"run-{uuid.uuid4().hex[:8]}"

        # 1. Intent Analysis
        intent = self.intent_analyzer.analyze_intent(request_text)

        # 2. Harness Routing
        required_domains = self.harness_router.route_intent(intent)

        # 3. Harness Selection
        selected_harnesses = self.harness_selector.select_harnesses(required_domains, self.harness_registry)

        # 4. Execution Planning
        plan = self.execution_planner.create_plan(active_run_id, selected_harnesses)

        # 5. Context Management
        context = self.context_manager.prepare_context(active_run_id)
        context.variables["request_text"] = request_text

        # 6. Execution Engine Execution
        harness_results = self.execution_engine.execute_plan(plan, context, self.harness_registry)

        # 7. Response Aggregation
        artifacts = self.response_aggregator.aggregate_responses(active_run_id, harness_results)

        return artifacts
