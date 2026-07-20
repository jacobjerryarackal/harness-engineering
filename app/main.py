import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import execute, memory, health

# Configure structured logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("symphony.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Symphony Harness OS API has started up successfully.")
    yield
    logger.info("Symphony Harness OS API is shutting down.")

app = FastAPI(
    title="🎼 Symphony Harness OS API",
    description="A model-agnostic engineering orchestration platform coordinating specialized harnesses.",
    version="1.0.0",
    lifespan=lifespan
)

# Parse allowed origins from environment variable with fallback to local origins
raw_origins = os.getenv("ALLOWED_ORIGINS", "")
if raw_origins:
    allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
else:
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

# Enable CORS for frontend application requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(execute.router)
app.include_router(memory.router)
app.include_router(health.router)


