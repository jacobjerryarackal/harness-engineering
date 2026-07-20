from fastapi import APIRouter, status
from app.schemas.schemas import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
def health_check() -> HealthResponse:
    """Returns application health status."""
    return HealthResponse(status="healthy")
