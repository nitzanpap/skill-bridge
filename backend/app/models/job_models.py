"""
Job Queue models for async processing.
"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class JobStatus(Enum):
    """Status of a job in the queue."""
    
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class JobType(Enum):
    """Types of jobs that can be processed."""
    
    COURSE_RECOMMENDATION = "course_recommendation"


class Job(BaseModel):
    """Model for a job in the queue."""
    
    id: str = Field(..., description="Unique job identifier")
    type: JobType = Field(..., description="Type of job to process")
    status: JobStatus = Field(default=JobStatus.QUEUED, description="Current job status")
    payload: Dict[str, Any] = Field(..., description="Job input data")
    result: Optional[Dict[str, Any]] = Field(None, description="Job result data")
    error: Optional[str] = Field(None, description="Error message if job failed")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Job creation time")
    started_at: Optional[datetime] = Field(None, description="Job start time")
    completed_at: Optional[datetime] = Field(None, description="Job completion time")
    position_in_queue: Optional[int] = Field(None, description="Position in the queue")
    estimated_wait_seconds: Optional[int] = Field(None, description="Estimated wait time in seconds")


class JobSubmitRequest(BaseModel):
    """Request model for job submission."""
    
    type: JobType = Field(..., description="Type of job to submit")
    payload: Dict[str, Any] = Field(..., description="Job payload")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "type": "course_recommendation",
                "payload": {
                    "resume_text": "Software engineer with Python experience...",
                    "job_description_text": "Looking for a Python developer...",
                    "threshold": 0.5
                }
            }
        }
    }


class JobSubmitResponse(BaseModel):
    """Response model for job submission."""
    
    job_id: str = Field(..., description="Unique job identifier")
    status: JobStatus = Field(..., description="Initial job status")
    position_in_queue: int = Field(..., description="Position in the queue")
    estimated_wait_seconds: int = Field(..., description="Estimated wait time in seconds")
    message: str = Field(..., description="Status message")


class JobStatusResponse(BaseModel):
    """Response model for job status check."""
    
    job_id: str = Field(..., description="Unique job identifier")
    status: JobStatus = Field(..., description="Current job status")
    position_in_queue: Optional[int] = Field(None, description="Position in queue if still queued")
    estimated_wait_seconds: Optional[int] = Field(None, description="Estimated wait time if queued")
    result: Optional[Dict[str, Any]] = Field(None, description="Job result if completed")
    error: Optional[str] = Field(None, description="Error message if failed")
    created_at: datetime = Field(..., description="Job creation time")
    started_at: Optional[datetime] = Field(None, description="Job start time")
    completed_at: Optional[datetime] = Field(None, description="Job completion time")