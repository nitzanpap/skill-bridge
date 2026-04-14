"""
Main entrypoint for the API.
"""

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from .api.routes import router
from .core.config import ALLOWED_ORIGINS, API_V1_STR, PINECONE_API_KEY, PINECONE_INDEX_NAME, PORT, PROJECT_NAME

logger = logging.getLogger(__name__)


def _ensure_pinecone_index() -> None:
    """Check if the Pinecone course index exists, and create + populate it if not."""
    if not PINECONE_API_KEY:
        logger.warning("PINECONE_API_KEY not set — skipping course index check")
        return

    from pinecone import Pinecone

    pc = Pinecone(api_key=PINECONE_API_KEY)
    existing = [idx.name for idx in pc.list_indexes()]

    if PINECONE_INDEX_NAME in existing:
        logger.info("Pinecone index '%s' already exists", PINECONE_INDEX_NAME)
        return

    logger.info("Pinecone index '%s' not found — creating and populating...", PINECONE_INDEX_NAME)
    from .utils.embedding_utils import prepare_and_index_courses

    prepare_and_index_courses()
    logger.info("Pinecone index '%s' is ready", PINECONE_INDEX_NAME)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await asyncio.to_thread(_ensure_pinecone_index)
    yield


# Create FastAPI application
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=PROJECT_NAME,
    description="API for custom-trained spaCy NER models",
    version="0.1.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS — disable credentials when using wildcard origins
_credentials = "*" not in ALLOWED_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=_credentials,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix=API_V1_STR)


@app.get("/")
async def root():
    """
    Root endpoint to check if API is running.
    """
    return {"message": f"Welcome to {PROJECT_NAME} API"}


@app.get("/healthz")
async def liveness_check():
    """
    Liveness probe endpoint.

    Used by infrastructure (e.g., Kubernetes) to determine if the application
    is running. Returns a simple successful response with status 200 if the
    application is alive.
    """
    return {"status": "alive"}


@app.get("/readyz")
async def readiness_check():
    """
    Readiness probe endpoint.

    Used by infrastructure (e.g., Kubernetes) to determine if the application
    is ready to serve traffic. This checks that all required services and
    resources are available.

    Currently checks:
    - Application is running

    Future enhancements could include:
    - Database connections are established
    - Model loading is complete
    - External service dependencies are available
    """
    # In a more complex application, you would check:
    # - Database connectivity
    # - Third-party API availability
    # - Model loading status
    # - Cache availability
    # - etc.

    # For now, we just return success, but this can be expanded
    # to include relevant health checks as the application grows
    return {"status": "ready"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
