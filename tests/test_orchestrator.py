import unittest
from core.interfaces import Domain
from core.intent_analyzer import PatternIntentAnalyzer
from core.harness_router import DomainHarnessRouter
from core.harness_selector import RegistryHarnessSelector
from core.execution_planner import SequentialExecutionPlanner
from core.orchestrator import SymphonyOrchestrator
from harnesses.registry import HarnessRegistry
from harnesses.specification import SpecificationHarness
from harnesses.engineering import EngineeringHarness
from harnesses.evaluation import EvaluationHarness

class TestOrchestratorControlPlane(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = HarnessRegistry()
        self.registry.register(SpecificationHarness())
        self.registry.register(EngineeringHarness())
        self.registry.register(EvaluationHarness())

    def test_intent_analyzer(self) -> None:
        analyzer = PatternIntentAnalyzer()
        intent = analyzer.analyze_intent("Please write code and verify with test cases")
        self.assertIn(Domain.ENGINEERING, intent.required_domains)
        self.assertIn(Domain.EVALUATION, intent.required_domains)

    def test_harness_router_canonical_order(self) -> None:
        router = DomainHarnessRouter()
        analyzer = PatternIntentAnalyzer()
        intent = analyzer.analyze_intent("write test code and spec")
        domains = router.route_intent(intent)
        
        # SPECIFICATION should precede ENGINEERING, which should precede EVALUATION
        spec_idx = domains.index(Domain.SPECIFICATION)
        eng_idx = domains.index(Domain.ENGINEERING)
        eval_idx = domains.index(Domain.EVALUATION)
        self.assertTrue(spec_idx < eng_idx < eval_idx)

    def test_harness_selector(self) -> None:
        selector = RegistryHarnessSelector()
        selected = selector.select_harnesses([Domain.SPECIFICATION, Domain.ENGINEERING], self.registry)
        self.assertEqual(len(selected), 2)
        self.assertEqual(selected[0].domain, Domain.SPECIFICATION)
        self.assertEqual(selected[1].domain, Domain.ENGINEERING)

    def test_execution_planner(self) -> None:
        planner = SequentialExecutionPlanner()
        spec_harness = SpecificationHarness()
        eng_harness = EngineeringHarness()
        
        plan = planner.create_plan("run-test", [spec_harness, eng_harness])
        self.assertEqual(plan.run_id, "run-test")
        self.assertEqual(len(plan.steps), 2)
        self.assertEqual(plan.steps[0].domain, Domain.SPECIFICATION)
        self.assertEqual(plan.steps[1].domain, Domain.ENGINEERING)

    def test_orchestrator_full_run(self) -> None:
        orchestrator = SymphonyOrchestrator(harness_registry=self.registry)
        artifacts = orchestrator.run("Write spec, implement and test a python module", run_id="run-100")
        
        self.assertTrue(artifacts.success)
        self.assertEqual(artifacts.run_id, "run-100")
        self.assertIn("spec.md", artifacts.generated_files)
        self.assertIn("output.py", artifacts.generated_files)
        self.assertIn("passed", artifacts.test_results)
        self.assertTrue(artifacts.test_results["passed"])

if __name__ == "__main__":
    unittest.main()
