import unittest
from core.interfaces import Domain, ExecutionContext
from harnesses.registry import HarnessRegistry
from harnesses.specification import SpecificationHarness
from harnesses.research import ResearchHarness
from harnesses.architecture import ArchitectureHarness
from harnesses.engineering import EngineeringHarness
from harnesses.evaluation import EvaluationHarness
from harnesses.deployment import DeploymentHarness
from harnesses.learning import LearningHarness

class TestHarnesses(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = HarnessRegistry()
        self.context = ExecutionContext(run_id="test-run")

    def test_registry_registration_and_retrieval(self) -> None:
        spec_harness = SpecificationHarness()
        self.registry.register(spec_harness)
        
        retrieved = self.registry.get_harness(Domain.SPECIFICATION)
        self.assertEqual(retrieved, spec_harness)
        self.assertEqual(retrieved.domain, Domain.SPECIFICATION)
        
        with self.assertRaises(KeyError):
            self.registry.get_harness(Domain.ENGINEERING)

    def test_specification_harness(self) -> None:
        harness = SpecificationHarness()
        self.context.variables["request_text"] = "Build a CLI calculator"
        
        result = harness.execute(self.context, {})
        self.assertTrue(result.success)
        self.assertIn("spec.md", result.outputs["generated_files"])
        self.assertIn("Build a CLI calculator", result.outputs["generated_files"]["spec.md"])
        self.assertTrue(result.updated_variables["specification_generated"])

    def test_research_harness(self) -> None:
        harness = ResearchHarness()
        result = harness.execute(self.context, {})
        self.assertTrue(result.success)
        self.assertIn("research_notes", result.outputs)
        self.assertTrue(result.updated_variables["research_completed"])

    def test_architecture_harness(self) -> None:
        harness = ArchitectureHarness()
        result = harness.execute(self.context, {})
        self.assertTrue(result.success)
        self.assertIn("architecture_blueprint.md", result.outputs["generated_files"])
        self.assertTrue(result.updated_variables["architecture_designed"])

    def test_engineering_harness(self) -> None:
        harness = EngineeringHarness()
        result = harness.execute(self.context, {
            "target_file": "calc.py",
            "code_content": "def add(a, b): return a + b"
        })
        self.assertTrue(result.success)
        self.assertEqual(result.outputs["generated_files"]["calc.py"], "def add(a, b): return a + b")
        self.assertTrue(result.updated_variables["code_written"])

    def test_evaluation_harness(self) -> None:
        harness = EvaluationHarness()
        result_pass = harness.execute(self.context, {"force_fail": False})
        self.assertTrue(result_pass.success)
        self.assertTrue(result_pass.outputs["test_results"]["passed"])
        
        result_fail = harness.execute(self.context, {"force_fail": True})
        self.assertFalse(result_fail.success)
        self.assertFalse(result_fail.outputs["test_results"]["passed"])
        self.assertEqual(result_fail.outputs["test_results"]["failed"], 1)

    def test_deployment_harness(self) -> None:
        harness = DeploymentHarness()
        result = harness.execute(self.context, {"deployment_status": "RUNNING"})
        self.assertTrue(result.success)
        self.assertEqual(result.outputs["deployment_status"], "RUNNING")
        self.assertTrue(result.updated_variables["deployed"])

    def test_learning_harness(self) -> None:
        harness = LearningHarness()
        self.context.variables["last_failure_reason"] = "Timeout Error"
        result = harness.execute(self.context, {})
        self.assertTrue(result.success)
        self.assertIn("Timeout Error", result.outputs["learning_notes"])
        self.assertEqual(len(result.outputs["new_triples"]), 1)
        self.assertTrue(result.updated_variables["learnings_extracted"])

if __name__ == "__main__":
    unittest.main()
