import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestAPIEndpoints(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_health_endpoint(self) -> None:
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")

    def test_root_endpoint(self) -> None:
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")

    def test_ready_endpoint(self) -> None:
        response = self.client.get("/ready")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")

    def test_execute_endpoint(self) -> None:
        payload = {
            "request_text": "Write spec, implement and test a python module",
            "run_id": "api-test-run-1"
        }
        response = self.client.post("/execute", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data["run_id"], "api-test-run-1")
        self.assertTrue(data["success"])
        self.assertIn("intent", data)
        self.assertIn("selected_harnesses", data)
        self.assertIn("execution_plan", data)
        self.assertIn("execution_artifacts", data)
        self.assertIn("telemetry_summary", data)
        self.assertIn("learning_updates", data)

    def test_memory_endpoint(self) -> None:
        # First execute an engineering intent
        self.client.post("/execute", json={"request_text": "Write spec and code", "run_id": "mem-test-run"})
        response = self.client.get("/memory")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("traces", data)
        self.assertIn("context_variables", data)
        self.assertIn("project_state", data)
        self.assertIn("mem-test-run", data["traces"])
        self.assertIn("request_text", data["context_variables"])
        self.assertIn("last_active_phase", data["project_state"])

    def test_knowledge_graph_endpoint(self) -> None:
        response = self.client.get("/knowledge-graph")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_failures_endpoint(self) -> None:
        response = self.client.get("/failures")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_telemetry_endpoint(self) -> None:
        response = self.client.get("/telemetry")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

if __name__ == "__main__":
    unittest.main()
