from abc import ABC, abstractmethod
from typing import List
from core.interfaces import ExecutionPlan, ExecutionStep
from harnesses.base import Harness

class ExecutionPlanner(ABC):
    """Interface for creating an execution strategy (ExecutionPlan)."""

    @abstractmethod
    def create_plan(self, run_id: str, harnesses: List[Harness]) -> ExecutionPlan:
        """Generates an execution plan for a list of harnesses."""
        pass

class SequentialExecutionPlanner(ExecutionPlanner):
    """Concrete execution planner that builds a linear execution strategy."""

    def create_plan(self, run_id: str, harnesses: List[Harness]) -> ExecutionPlan:
        """Creates a sequential plan executing harnesses in order."""
        steps: List[ExecutionStep] = []
        for idx, harness in enumerate(harnesses):
            step = ExecutionStep(
                step_id=f"step_{idx + 1}_{harness.domain.value.lower()}",
                domain=harness.domain,
                parameters={}
            )
            steps.append(step)

        return ExecutionPlan(
            run_id=run_id,
            steps=steps,
            metadata={"strategy": "sequential"}
        )
