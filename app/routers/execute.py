import logging
from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import Container, get_container
from app.schemas.schemas import ExecuteRequest, ExecuteResponse

logger = logging.getLogger("symphony.api.execute")

router = APIRouter(tags=["Execution"])

@router.post("/execute", response_model=ExecuteResponse, status_code=status.HTTP_200_OK)
def execute_goal(
    body: ExecuteRequest,
    c: Container = Depends(get_container)
) -> ExecuteResponse:
    """Executes a complete Symphony workflow for the provided engineering goal."""
    logger.info(f"Received execution request: {body.request_text}")
    
    try:
        # 1. Inspect intent and routing for response representation
        intent = c.orchestrator.intent_analyzer.analyze_intent(body.request_text)
        required_domains = c.orchestrator.harness_router.route_intent(intent)
        selected = c.orchestrator.harness_selector.select_harnesses(required_domains, c.harness_registry)

        # 2. Invoke Orchestrator
        artifacts = c.orchestrator.run(body.request_text, run_id=body.run_id)

        # 3. Execute Production Feedback Loop
        runtime_output = c.production_runtime.run_deployment(artifacts)
        telemetry = c.telemetry_collector.collect_telemetry(artifacts.run_id, runtime_output)
        c.telemetry_history.append(telemetry)

        extracted_events = c.knowledge_extractor.extract_knowledge(telemetry)
        learning_updates = c.learning_engine.generate_updates(extracted_events)
        c.memory_updater.apply_updates(
            learning_updates,
            c.knowledge_graph,
            c.policy_engine,
            c.failure_repository,
            c.evidence_store
        )

        # Store execution artifacts as hard evidence
        c.evidence_store.store_evidence(
            run_id=artifacts.run_id,
            evidence_type="execution_artifacts",
            content={
                "generated_files": artifacts.generated_files,
                "test_results": artifacts.test_results,
                "deployment_status": artifacts.deployment_status
            }
        )

        plan_summary = [
            {"step_id": f"step_{idx+1}_{h.domain.value.lower()}", "domain": h.domain.value}
            for idx, h in enumerate(selected)
        ]

        return ExecuteResponse(
            run_id=artifacts.run_id,
            success=artifacts.success,
            intent={
                "intent_type": intent.intent_type,
                "required_domains": [d.value for d in intent.required_domains]
            },
            selected_harnesses=[h.domain.value for h in selected],
            execution_plan=plan_summary,
            execution_artifacts={
                "generated_files": artifacts.generated_files,
                "test_results": artifacts.test_results,
                "deployment_status": artifacts.deployment_status
            },
            telemetry_summary=telemetry,
            learning_updates=learning_updates
        )

    except ValueError as ve:
        logger.warning(f"Validation error during execution: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid execution request: {str(ve)}"
        )
    except Exception as e:
        logger.error(f"Error during orchestrator execution: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Execution error: {str(e)}"
        )

