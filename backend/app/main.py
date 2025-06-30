"""
Main entrypoint for the API.
"""

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router
from .core.config import ALLOWED_ORIGINS, API_V1_STR, PORT, PROJECT_NAME
from .services.job_queue_service import JobQueueService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifecycle events.
    """
    # Startup
    await JobQueueService.initialize()
    await JobQueueService.start_worker()
    
    # Start periodic cleanup task
    cleanup_task = asyncio.create_task(periodic_cleanup())
    
    yield
    
    # Shutdown
    cleanup_task.cancel()
    await JobQueueService.stop_worker()


async def periodic_cleanup():
    """
    Periodically clean up old jobs from memory.
    """
    while True:
        await asyncio.sleep(3600)  # Run every hour
        await JobQueueService.cleanup_old_jobs()


# Create FastAPI application
app = FastAPI(
    title=PROJECT_NAME,
    description="API for custom-trained spaCy NER models",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
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
