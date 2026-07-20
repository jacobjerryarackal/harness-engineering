import logging
from fastapi import FastAPI
from app.routers import execute, memory, health

# Configure structured logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("symphony.api")

app = FastAPI(
    title="🎼 Symphony Harness OS API",
    description="A model-agnostic engineering orchestration platform coordinating specialized harnesses.",
    version="1.0.0"
)

# Register routers
app.include_router(execute.router)
app.include_router(memory.router)
app.include_router(health.router)

@app.on_event("startup")
def startup_event() -> None:
    logger.info("Symphony Harness OS API has started up successfully.")

@app.on_event("shutdown")
def shutdown_event() -> None:
    logger.info("Symphony Harness OS API is shutting down.")
