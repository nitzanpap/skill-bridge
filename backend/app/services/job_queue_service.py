"""
Job Queue Service for managing async job processing.
"""

import asyncio
import logging
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
import numpy as np
import threading

from ..models.job_models import Job, JobStatus, JobType
from ..models.schemas import CourseRecommendationRequest, CourseRecommendationResponse
from ..services.cache_service import CacheService
from ..services.nlp_service import NLPService
from ..services.rag_service import RAGService
from ..services.similarity_service import SimilarityService

logger = logging.getLogger(__name__)


class JobQueueService:
    """Service for managing job queue and processing."""

    # In-memory storage for jobs (will be replaced with Redis later)
    _jobs: Dict[str, Job] = {}
    _job_queue: Optional[asyncio.Queue] = None
    _worker_task: Optional[asyncio.Task] = None
    _is_initialized: bool = False
    _position_counter: int = 0  # Atomic counter for queue positions
    _counter_lock = threading.Lock()  # Thread safety for position counter

    # Configuration
    MAX_QUEUE_SIZE = 100
    JOB_TIMEOUT_SECONDS = 300  # 5 minutes per job
    JOB_TTL_HOURS = 24  # Keep completed jobs for 24 hours
    AVERAGE_JOB_DURATION_SECONDS = 60  # Average time per job for estimation

    @classmethod
    def _convert_numpy_types(cls, obj: Any) -> Any:
        """Convert numpy types to Python native types for JSON serialization."""
        try:
            if obj is None:
                return obj
            elif isinstance(obj, np.bool_):
                return bool(obj)
            elif isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, dict):
                return {
                    key: cls._convert_numpy_types(value) for key, value in obj.items()
                }
            elif isinstance(obj, (list, tuple)):
                return [cls._convert_numpy_types(item) for item in obj]
            elif hasattr(obj, "__dict__"):
                # Handle objects with attributes
                return cls._convert_numpy_types(obj.__dict__)
            else:
                return obj
        except Exception as e:
            logger.warning(f"Failed to convert numpy type {type(obj)}: {str(e)}")
            return str(obj)  # Fallback to string representation

    @classmethod
    async def initialize(cls):
        """Initialize the job queue service."""
        if not cls._is_initialized:
            cls._job_queue = asyncio.Queue(maxsize=cls.MAX_QUEUE_SIZE)
            cls._is_initialized = True
            logger.info("Job queue service initialized")

    @classmethod
    async def start_worker(cls):
        """Start the background worker for processing jobs."""
        if cls._worker_task is None or cls._worker_task.done():
            cls._worker_task = asyncio.create_task(cls._process_jobs())
            logger.info("Job queue worker started")

    @classmethod
    async def stop_worker(cls):
        """Stop the background worker."""
        if cls._worker_task and not cls._worker_task.done():
            cls._worker_task.cancel()
            try:
                await cls._worker_task
            except asyncio.CancelledError:
                pass
            cls._worker_task = None
            logger.info("Job queue worker stopped")

    @classmethod
    async def submit_job(cls, job_type: JobType, payload: Dict) -> Job:
        """Submit a new job to the queue."""
        if not cls._is_initialized:
            await cls.initialize()

        # Create job
        job_id = str(uuid.uuid4())
        job = Job(
            id=job_id,
            type=job_type,
            status=JobStatus.QUEUED,
            payload=payload,
            created_at=datetime.utcnow(),
        )

        # Store job
        cls._jobs[job_id] = job

        # Atomic position assignment to avoid race conditions
        with cls._counter_lock:
            cls._position_counter += 1
            job.position_in_queue = cls._position_counter
            job.estimated_wait_seconds = (
                cls._position_counter - 1
            ) * cls.AVERAGE_JOB_DURATION_SECONDS

        # Add to queue
        if cls._job_queue:
            await cls._job_queue.put(job_id)

        logger.info(
            f"Job {job_id} submitted to queue at position {job.position_in_queue}"
        )
        return job

    @classmethod
    def get_job(cls, job_id: str) -> Optional[Job]:
        """Get a job by ID."""
        job = cls._jobs.get(job_id)

        if job and job.status == JobStatus.QUEUED:
            # Keep the original position assigned during submission
            # Only update estimated wait time based on queue size approximation
            if cls._job_queue:
                job.estimated_wait_seconds = max(
                    0, cls._job_queue.qsize() * cls.AVERAGE_JOB_DURATION_SECONDS
                )

        # Convert numpy types in result for serialization safety
        if job and job.result:
            try:
                job.result = cls._convert_numpy_types(job.result)
            except Exception as e:
                logger.error(
                    f"Error converting numpy types in job {job_id} result: {str(e)}"
                )
                # If conversion fails, set result to None to prevent serialization errors
                job.result = None
                job.error = f"Result serialization error: {str(e)}"

        return job

    @classmethod
    def get_queue_status(cls) -> Dict:
        """Get current queue status."""
        return {
            "queue_size": cls._job_queue.qsize() if cls._job_queue else 0,
            "total_jobs": len(cls._jobs),
            "worker_running": cls._worker_task is not None
            and not cls._worker_task.done(),
            "jobs_by_status": cls._get_jobs_by_status(),
        }

    @classmethod
    def _get_jobs_by_status(cls) -> Dict[str, int]:
        """Get count of jobs by status."""
        status_counts = {status.value: 0 for status in JobStatus}
        for job in cls._jobs.values():
            status_counts[job.status.value] += 1
        return status_counts

    @classmethod
    async def _process_jobs(cls):
        """Background worker to process jobs from the queue."""
        logger.info("Job worker started processing")

        while True:
            try:
                # Get next job from queue
                if not cls._job_queue:
                    break
                job_id = await cls._job_queue.get()
                job = cls._jobs.get(job_id)

                if not job:
                    logger.error(f"Job {job_id} not found in storage")
                    continue

                # Update job status
                job.status = JobStatus.RUNNING
                job.started_at = datetime.utcnow()
                job.position_in_queue = None
                job.estimated_wait_seconds = None

                logger.info(f"Processing job {job_id}")

                try:
                    # Process based on job type
                    if job.type == JobType.COURSE_RECOMMENDATION:
                        result = await cls._process_course_recommendation(job.payload)
                        # Convert numpy types to Python native types for serialization
                        job.result = cls._convert_numpy_types(result)
                        job.status = JobStatus.COMPLETED
                    else:
                        raise ValueError(f"Unknown job type: {job.type}")

                    job.completed_at = datetime.utcnow()
                    logger.info(f"Job {job_id} completed successfully")

                except asyncio.TimeoutError:
                    job.status = JobStatus.FAILED
                    job.error = "Job processing timed out"
                    job.completed_at = datetime.utcnow()
                    logger.error(f"Job {job_id} timed out")

                except Exception as e:
                    job.status = JobStatus.FAILED
                    job.error = str(e)
                    job.completed_at = datetime.utcnow()
                    logger.error(f"Job {job_id} failed: {str(e)}")

            except asyncio.CancelledError:
                logger.info("Job worker cancelled")
                break
            except Exception as e:
                logger.error(f"Unexpected error in job worker: {str(e)}")
                await asyncio.sleep(1)  # Brief pause before continuing

    @classmethod
    async def _process_course_recommendation(cls, payload: Dict) -> Dict:
        """Process a course recommendation job."""
        # Extract parameters
        resume_text = payload.get("resume_text", "")
        job_description_text = payload.get("job_description_text", "")
        threshold = payload.get("threshold", 0.5)

        # Check cache first
        cached_result = CacheService.get_course_recommendation(
            resume_text, job_description_text, threshold
        )

        if cached_result:
            logger.info("Returning cached course recommendations")
            return cached_result

        logger.info("Processing new course recommendation request")

        # Get skill comparison
        skill_comparison = NLPService.compare_skills_semantic(
            resume_text,
            job_description_text,
            threshold=threshold,
        )

        # Extract all job skills
        all_job_skills = set(
            skill_comparison["matched_skills"] + skill_comparison["missing_skills"]
        )

        # Generate course recommendations
        recommendations = RAGService.generate_course_recommendations(
            job_description_text,
            resume_text,
            ground_truth_skills=all_job_skills,
        )

        # Calculate scores for each course
        user_skills_set = set(recommendations["user_skills"])
        job_skills_set = set(recommendations["job_skills"])
        original_score = skill_comparison["score"]

        for course in recommendations["recommended_courses"]:
            # Extract course skills
            course_description = course.get("description", "")
            course_entities = NLPService.extract_distinct_entities_from_all_models(
                course_description
            )
            course_skills = {
                e.text
                for e in course_entities
                if e.label.upper() in ("SKILL", "PRODUCT", "ORG", "GPE", "LANGUAGE")
            }

            # Calculate enhanced score
            enhanced_skills = user_skills_set.union(course_skills)
            enhanced_score_result = SimilarityService.semantic_matching_score(
                job_skills_set, enhanced_skills, threshold=threshold
            )

            course["potential_score"] = enhanced_score_result["score"]
            course["score_improvement"] = max(
                0, enhanced_score_result["score"] - original_score
            )

        # Prepare response
        response_data = {
            "recommended_courses": recommendations["recommended_courses"],
            "skill_gap": recommendations["skill_gap"],
            "job_skills": recommendations["job_skills"],
            "user_skills": recommendations["user_skills"],
            "recommendations_text": recommendations["recommendations_text"],
            "matching_details": skill_comparison["matching_details"],
        }

        # Cache the result
        CacheService.set_course_recommendation(
            resume_text,
            job_description_text,
            threshold,
            response_data,
        )

        return response_data

    @classmethod
    async def cleanup_old_jobs(cls):
        """Remove jobs older than TTL."""
        cutoff_time = datetime.utcnow() - timedelta(hours=cls.JOB_TTL_HOURS)
        jobs_to_remove = []

        for job_id, job in cls._jobs.items():
            if job.completed_at and job.completed_at < cutoff_time:
                jobs_to_remove.append(job_id)

        for job_id in jobs_to_remove:
            del cls._jobs[job_id]

        if jobs_to_remove:
            logger.info(f"Cleaned up {len(jobs_to_remove)} old jobs")
