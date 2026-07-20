from pydantic import BaseModel, ConfigDict, Field
from typing import Any, Dict, List, Optional

class ExecuteRequest(BaseModel):
    request_text: str = Field(
        ...,
        description="The engineering goal or task request.",
        json_schema_extra={"example": "Write spec, implement and test a python module"}
    )
    run_id: Optional[str] = Field(None, description="Optional custom unique run identifier.")

class ExecuteResponse(BaseModel):
    run_id: str
    success: bool
    intent: Dict[str, Any]
    selected_harnesses: List[str]
    execution_plan: List[Dict[str, Any]]
    execution_artifacts: Dict[str, Any]
    telemetry_summary: Dict[str, Any]
    learning_updates: List[Dict[str, Any]]

class MemoryResponse(BaseModel):
    traces: Dict[str, List[str]] = Field(..., description="Active run execution logs and traces.")
    context_variables: Dict[str, Any] = Field(..., description="Active session context variables.")
    project_state: Dict[str, Any] = Field(..., description="Project workspace state.")

class TripleModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    subject: str
    predicate: str
    object: str = Field(..., serialization_alias="obj")
    metadata: Dict[str, Any]


class FailureModel(BaseModel):
    run_id: str
    component: str
    error_message: str
    stack_trace: Optional[str] = None
    timestamp: float

class TelemetryModel(BaseModel):
    run_id: str
    status: str
    exit_code: int
    logs: List[str]
    metrics: Dict[str, Any]
    timestamp: float

class HealthResponse(BaseModel):
    status: str = "healthy"
