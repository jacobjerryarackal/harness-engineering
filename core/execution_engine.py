from abc import ABC, abstractmethod
from typing import Any, List, Optional
from core.interfaces import ExecutionContext, ExecutionPlan, HarnessResult
from harnesses.registry import HarnessRegistry
from memory.memory_service import MemoryService
from memory.failure_repository import FailureRepository

class ExecutionEngine(ABC):
    """Interface for coordinating the execution of harness plans."""

    @abstractmethod
    def execute_plan(
        self,
        plan: ExecutionPlan,
        context: ExecutionContext,
        registry: HarnessRegistry
    ) -> List[HarnessResult]:
        """Runs the execution steps in order, passing states along."""
        pass

class Engine(ExecutionEngine):
    """Concrete execution engine running plans sequentially and coordinating states."""

    def __init__(
        self,
        memory_service: Optional[MemoryService] = None,
        failure_repo: Optional[FailureRepository] = None
    ) -> None:
        self._memory_service = memory_service
        self._failure_repo = failure_repo

    def execute_plan(
        self,
        plan: ExecutionPlan,
        context: ExecutionContext,
        registry: HarnessRegistry
    ) -> List[HarnessResult]:
        """Runs execution steps sequentially, passing updated states and stopping on failure."""
        results: List[HarnessResult] = []
        run_id = plan.run_id

        if self._memory_service:
            self._memory_service.log_trace(run_id, f"Engine starting execution of plan containing {len(plan.steps)} steps.")

        for step in plan.steps:
            if self._memory_service:
                self._memory_service.log_trace(run_id, f"Executing step: {step.step_id} (Domain: {step.domain.value})")

            try:
                # Retrieve harness from registry
                harness = registry.get_harness(step.domain)
                
                # Execute harness
                result = harness.execute(context, step.parameters)
                results.append(result)

                if self._memory_service:
                    self._memory_service.log_trace(run_id, f"Step {step.step_id} logs: {'; '.join(result.logs)}")

                # State and variable propagation
                context.variables.update(result.updated_variables)
                context.state.update(result.updated_state)

                if not result.success:
                    error_msg = result.error_message or "Execution failed without details"
                    if self._memory_service:
                        self._memory_service.log_trace(run_id, f"Execution halted due to failure in step {step.step_id}: {error_msg}")
                    
                    if self._failure_repo:
                        self._failure_repo.log_failure(run_id, step.domain.value, error_msg)
                    break

            except Exception as e:
                error_msg = str(e)
                if self._memory_service:
                    self._memory_service.log_trace(run_id, f"Execution halted due to exception in step {step.step_id}: {error_msg}")
                
                if self._failure_repo:
                    self._failure_repo.log_failure(run_id, step.domain.value, error_msg)
                
                # Append a failed harness result
                results.append(HarnessResult(
                    success=False,
                    error_message=error_msg,
                    logs=[f"Error running step: {error_msg}"]
                ))
                break

        if self._memory_service:
            self._memory_service.log_trace(run_id, f"Engine finished plan execution. Total steps run: {len(results)}")

        return results
