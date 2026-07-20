import unittest
from core.interfaces import ExecutionArtifacts
from memory.knowledge_graph import KnowledgeGraphService
from memory.policy_engine import PolicyEngineService
from memory.failure_repository import FailureRepository
from runtime.production import ProductionRuntime
from runtime.telemetry import TelemetryCollector
from runtime.knowledge_extraction import KnowledgeExtractor
from runtime.learning_engine import LearningEngine
from runtime.memory_update import MemoryUpdater

class TestRuntimeFeedbackLoop(unittest.TestCase):
    def setUp(self) -> None:
        self.kg = KnowledgeGraphService()
        self.policy = PolicyEngineService()
        self.failures = FailureRepository()
        
        self.runtime = ProductionRuntime()
        self.collector = TelemetryCollector()
        self.extractor = KnowledgeExtractor()
        self.learning_engine = LearningEngine()
        self.updater = MemoryUpdater()

    def test_successful_runtime_feedback_loop(self) -> None:
        artifacts = ExecutionArtifacts(
            run_id="run-success",
            success=True,
            generated_files={"main.py": "print('ok')"},
            deployment_status="DEPLOYED"
        )
        
        # 1. Run deployment in production runtime
        rt_out = self.runtime.run_deployment(artifacts)
        self.assertEqual(rt_out["status"], "RUNNING")
        
        # 2. Collect Telemetry
        telemetry = self.collector.collect_telemetry("run-success", rt_out)
        self.assertEqual(telemetry["exit_code"], 0)
        
        # 3. Extract Knowledge
        events = self.extractor.extract_knowledge(telemetry)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["type"], "SUCCESS_EVENT")
        
        # 4. Learning Engine updates
        updates = self.learning_engine.generate_updates(events)
        self.assertEqual(len(updates), 1)
        self.assertEqual(updates[0]["action"], "ADD_TRIPLE")
        
        # 5. Apply Memory Updates
        self.updater.apply_updates(updates, self.kg, self.policy, self.failures)
        
        # Verify Knowledge Graph updated
        triples = self.kg.get_all_triples()
        self.assertEqual(len(triples), 1)
        self.assertEqual(triples[0][0], "Run:run-success")
        self.assertEqual(triples[0][1], "deployed_successfully")

    def test_crashed_runtime_feedback_loop(self) -> None:
        artifacts = ExecutionArtifacts(
            run_id="run-crashed",
            success=True,
            generated_files={"buggy.py": "raise ValueError('Simulated crash')"},
            deployment_status="DEPLOYED"
        )
        
        rt_out = self.runtime.run_deployment(artifacts)
        self.assertEqual(rt_out["status"], "CRASHED")
        
        telemetry = self.collector.collect_telemetry("run-crashed", rt_out)
        self.assertEqual(telemetry["exit_code"], 127)
        
        events = self.extractor.extract_knowledge(telemetry)
        self.assertEqual(events[0]["type"], "FAILURE_EVENT")
        
        updates = self.learning_engine.generate_updates(events)
        self.assertEqual(len(updates), 2)  # Log Failure + Add Triple
        
        self.updater.apply_updates(updates, self.kg, self.policy, self.failures)
        
        # Verify FailureRepository updated
        fail_logs = self.failures.get_failures("run-crashed")
        self.assertEqual(len(fail_logs), 1)
        self.assertIn("simulated runtime failure", fail_logs[0]["error_message"])

if __name__ == "__main__":
    unittest.main()
