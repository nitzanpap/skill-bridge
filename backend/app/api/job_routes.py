"""
API routes for job queue management.
"""

import logging
import json
from fastapi import APIRouter, HTTPException

from ..models.job_models import (
    JobSubmitRequest,
    JobSubmitResponse,
    JobStatusResponse,
    JobStatus,
    JobType,
)
from ..services.job_queue_service import JobQueueService

logger = logging.getLogger(__name__)

# Create router for job endpoints
job_router = APIRouter(prefix="/jobs", tags=["Job Queue"])


def ensure_json_serializable(obj):
    """Ensure an object is completely JSON serializable by testing it."""
    try:
        json.dumps(obj)
        return obj
    except (TypeError, ValueError) as e:
        logger.warning(f"Object not JSON serializable: {e}, converting to string")
        return str(obj)


@job_router.post("/submit", response_model=JobSubmitResponse)
async def submit_job(request: JobSubmitRequest):
    """
    Submit a new job to the processing queue.
    
    This endpoint immediately returns a job ID that can be used to check status.
    The actual processing happens asynchronously in the background.
    
    Returns:
        - job_id: Unique identifier for tracking the job
        - status: Current job status (initially 'queued')
        - position_in_queue: Current position in the processing queue
        - estimated_wait_seconds: Estimated time until processing starts
    """
    try:
        # Validate job type and payload based on type
        if request.type == JobType.COURSE_RECOMMENDATION:
            # Validate required fields for course recommendation
            required_fields = ["resume_text", "job_description_text"]
            for field in required_fields:
                if field not in request.payload or not request.payload[field].strip():
                    raise HTTPException(
                        status_code=400,
                        detail=f"Missing required field in payload: {field}"
                    )
        
        # Submit job to queue
        job = await JobQueueService.submit_job(request.type, request.payload)
        
        return JobSubmitResponse(
            job_id=job.id,
            status=job.status,
            position_in_queue=job.position_in_queue or 0,
            estimated_wait_seconds=job.estimated_wait_seconds or 0,
            message=f"Job submitted successfully. Position in queue: {job.position_in_queue}"
        )
        
    except asyncio.QueueFull:
        raise HTTPException(
            status_code=503,
            detail="Job queue is full. Please try again later."
        )
    except Exception as e:
        logger.error(f"Error submitting job: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error submitting job: {str(e)}"
        )


@job_router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    """
    Get the current status of a submitted job.
    
    Check the status of a job using its ID. Returns current status,
    queue position (if still queued), and results (if completed).
    
    Status values:
    - queued: Job is waiting in the queue
    - running: Job is currently being processed
    - completed: Job finished successfully (includes results)
    - failed: Job failed during processing (includes error message)
    """
    try:
        job = JobQueueService.get_job(job_id)
        
        if not job:
            raise HTTPException(
                status_code=404,
                detail=f"Job {job_id} not found"
            )
        
        # Ensure result is JSON serializable to prevent proxy issues
        safe_result = None
        if job.result:
            safe_result = ensure_json_serializable(job.result)
        
        # Create response with explicit serialization handling
        response = JobStatusResponse(
            job_id=job.id,
            status=job.status,
            position_in_queue=job.position_in_queue,
            estimated_wait_seconds=job.estimated_wait_seconds,
            result=safe_result,
            error=job.error,
            created_at=job.created_at,
            started_at=job.started_at,
            completed_at=job.completed_at
        )
        
        # Debug: Log response size and content type for troubleshooting proxy issues
        if job.result:
            logger.info(f"Job {job_id} response has result of type {type(job.result)} with keys {list(job.result.keys()) if isinstance(job.result, dict) else 'N/A'}")
        
        return response
        
    except Exception as e:
        logger.error(f"Error getting job status for {job_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving job status: {str(e)}"
        )


@job_router.get("/queue/status")
async def get_queue_status():
    """
    Get overall queue status and statistics.
    
    Returns information about the current state of the job queue,
    including queue size, job counts by status, and worker status.
    """
    return JobQueueService.get_queue_status()


# Add asyncio import at the top
import asyncio