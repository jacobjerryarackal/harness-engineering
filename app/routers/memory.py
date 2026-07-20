from fastapi import APIRouter, Depends
from typing import List
from app.dependencies import Container, get_container
from app.schemas.schemas import MemoryResponse, TripleModel, FailureModel, TelemetryModel

router = APIRouter(tags=["Shared Core Services & State"])

@router.get("/memory", response_model=MemoryResponse)
def get_memory(c: Container = Depends(get_container)) -> MemoryResponse:
    """Retrieves the current execution traces, active session variables, and project state."""
    return MemoryResponse(
        traces=c.memory_service._traces,
        context_variables=c.context_service.get_all_variables(),
        project_state=c.state_service.get_all_states()
    )

@router.get("/knowledge-graph", response_model=List[TripleModel])
def get_knowledge_graph(c: Container = Depends(get_container)) -> List[TripleModel]:
    """Retrieves all stored facts from the semantic Knowledge Graph."""
    triples = c.knowledge_graph.get_all_triples()
    # triples contains tuples: (subject, predicate, obj, metadata)
    return [
        TripleModel(subject=s, predicate=p, object=o, metadata=meta)
        for s, p, o, meta in triples
    ]

@router.get("/failures", response_model=List[FailureModel])
def get_failures(c: Container = Depends(get_container)) -> List[FailureModel]:
    """Retrieves all recorded failures from the Failure Repository."""
    failures = c.failure_repository.get_failures()
    return [
        FailureModel(
            run_id=f["run_id"],
            component=f["component"],
            error_message=f["error_message"],
            stack_trace=f.get("stack_trace"),
            timestamp=f["timestamp"]
        )
        for f in failures
    ]

@router.get("/telemetry", response_model=List[TelemetryModel])
def get_telemetry(c: Container = Depends(get_container)) -> List[TelemetryModel]:
    """Retrieves the complete telemetry logs and performance metric history."""
    return [
        TelemetryModel(
            run_id=t["run_id"],
            status=t["status"],
            exit_code=t["exit_code"],
            logs=t["logs"],
            metrics=t["metrics"],
            timestamp=t["timestamp"]
        )
        for t in c.telemetry_history
    ]
