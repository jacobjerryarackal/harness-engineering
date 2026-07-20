import unittest
from memory.memory_service import MemoryService
from memory.context_service import ContextService
from memory.state_service import StateService
from memory.knowledge_graph import KnowledgeGraphService
from memory.evidence_store import EvidenceStoreService
from memory.failure_repository import FailureRepository
from memory.policy_engine import PolicyEngineService

class TestMemoryServices(unittest.TestCase):
    def test_memory_service(self) -> None:
        service = MemoryService()
        service.log_trace("run-1", "Step 1 started")
        service.log_trace("run-1", "Step 1 finished")
        
        self.assertEqual(len(service.get_traces("run-1")), 2)
        self.assertEqual(service.get_traces("run-1")[0], "Step 1 started")
        
        service.clear_traces("run-1")
        self.assertEqual(len(service.get_traces("run-1")), 0)

    def test_context_service(self) -> None:
        service = ContextService()
        service.set_variable("var1", "value1")
        self.assertEqual(service.get_variable("var1"), "value1")
        self.assertIsNone(service.get_variable("non_existent"))
        self.assertEqual(service.get_variable("non_existent", "default"), "default")
        
        all_vars = service.get_all_variables()
        self.assertIn("var1", all_vars)
        self.assertEqual(all_vars["var1"], "value1")
        
        service.clear_context()
        self.assertEqual(len(service.get_all_variables()), 0)

    def test_state_service(self) -> None:
        service = StateService()
        service.set_state("state1", "active")
        self.assertEqual(service.get_state("state1"), "active")
        
        service.clear_state()
        self.assertEqual(len(service.get_all_states()), 0)

    def test_knowledge_graph(self) -> None:
        service = KnowledgeGraphService()
        service.add_triple("SpecificationHarness", "generates", "spec.md", {"source": "execution"})
        
        all_triples = service.get_all_triples()
        self.assertEqual(len(all_triples), 1)
        self.assertEqual(all_triples[0][0], "SpecificationHarness")
        self.assertEqual(all_triples[0][1], "generates")
        self.assertEqual(all_triples[0][2], "spec.md")
        self.assertEqual(all_triples[0][3]["source"], "execution")
        
        query_res = service.query_triples(predicate="generates")
        self.assertEqual(len(query_res), 1)
        
        query_none = service.query_triples(subject="NonExistent")
        self.assertEqual(len(query_none), 0)

    def test_evidence_store(self) -> None:
        service = EvidenceStoreService()
        service.store_evidence("run-12", "code", "print('hello')", {"filename": "hello.py"})
        
        run_ev = service.get_evidence("run-12")
        self.assertEqual(len(run_ev), 1)
        self.assertEqual(run_ev[0]["type"], "code")
        self.assertEqual(run_ev[0]["content"], "print('hello')")
        
        service.clear_evidence()
        self.assertEqual(len(service.get_all_evidence()), 0)

    def test_failure_repository(self) -> None:
        repo = FailureRepository()
        repo.log_failure("run-3", "Engineering", "SyntaxError: invalid syntax", "stack trace content")
        
        failures = repo.get_failures("run-3")
        self.assertEqual(len(failures), 1)
        self.assertEqual(failures[0]["component"], "Engineering")
        self.assertEqual(failures[0]["error_message"], "SyntaxError: invalid syntax")
        self.assertEqual(failures[0]["stack_trace"], "stack trace content")

    def test_policy_engine(self) -> None:
        engine = PolicyEngineService()
        engine.add_policy(
            "file_size_check",
            "Ensures files generated are non-empty",
            lambda ctx: len(ctx.get("file_content", "")) > 0
        )
        
        self.assertTrue(engine.evaluate_policy("file_size_check", {"file_content": "import sys"}))
        self.assertFalse(engine.evaluate_policy("file_size_check", {"file_content": ""}))
        self.assertTrue(engine.evaluate_policy("non_existent_policy", {}))

if __name__ == "__main__":
    unittest.main()
