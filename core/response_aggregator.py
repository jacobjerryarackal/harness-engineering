from abc import ABC, abstractmethod
from typing import Dict, List
from core.interfaces import ExecutionArtifacts, HarnessResult

class ResponseAggregator(ABC):
    """Interface to compile and consolidate harness execution results."""

    @abstractmethod
    def aggregate_responses(self, run_id: str, harness_results: List[HarnessResult]) -> ExecutionArtifacts:
        """Assembles artifacts and states from harness results."""
        pass

class ArtifactAggregator(ResponseAggregator):
    """Concrete ResponseAggregator generating execution artifacts from harness outcomes."""

    def aggregate_responses(self, run_id: str, harness_results: List[HarnessResult]) -> ExecutionArtifacts:
        """Consolidates generated files, test results, and statuses."""
        success = True
        generated_files: Dict[str, str] = {}
        test_results = {}
        deployment_status = None

        for result in harness_results:
            if not result.success:
                success = False

            # Collect files if they exist in the outputs
            if "generated_files" in result.outputs:
                generated_files.update(result.outputs["generated_files"])

            # Collect test results if evaluation run
            if "test_results" in result.outputs:
                test_results.update(result.outputs["test_results"])

            # Collect deployment status if deployment run
            if "deployment_status" in result.outputs:
                deployment_status = result.outputs["deployment_status"]

        return ExecutionArtifacts(
            run_id=run_id,
            success=success,
            generated_files=generated_files,
            test_results=test_results,
            deployment_status=deployment_status,
            harness_results=harness_results
        )
