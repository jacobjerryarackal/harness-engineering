from fastapi import APIRouter, status
from app.schemas.schemas import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/", response_model=HealthResponse, status_code=status.HTTP_200_OK)
def root_check() -> HealthResponse:
    """Returns application root status."""
    return HealthResponse(status="healthy")

@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
def health_check() -> HealthResponse:
    """Returns application health status."""
    return HealthResponse(status="healthy")

@router.get("/ready", response_model=HealthResponse, status_code=status.HTTP_200_OK)
def ready_check() -> HealthResponse:
    """Returns application readiness status."""
    return HealthResponse(status="healthy")
