"""
API routes for the Skill Bridge application.
"""

import logging
from fastapi import APIRouter, HTTPException

logger = logging.getLogger(__name__)

from ..models.schemas import (
    CourseRecommendationRequest,
    CourseRecommendationResponse,
)
from ..services.cache_service import CacheService
from ..services.nlp_service import NLPService
from ..services.rag_service import RAGService
from ..services.similarity_service import SimilarityService
from .job_routes import job_router

# Create router instance
router = APIRouter()

# Include job routes
router.include_router(job_router)


@router.post("/recommend-courses", response_model=CourseRecommendationResponse)
async def recommend_courses(request: CourseRecommendationRequest):
    """
    Recommend courses based on skill gap between resume and job description.
    Now with disk-based caching for identical requests.

    This endpoint performs:
    1. Check cache for existing results
    2. Named entity extraction to identify skills in both the resume and job description
    3. Calculation of the skill gap between the two
    4. Retrieval of relevant course data using vector similarity search
    5. LLM-based generation of course recommendations tailored to the skill gap
    6. Processing of LLM outputs to provide structured course recommendations with URLs
    7. Cache results for future identical requests
    8. Returns detailed skill matching information with similarity scores
    """
    try:
        # Check cache first for existing results
        cached_result = CacheService.get_course_recommendation(
            request.resume_text, request.job_description_text, request.threshold
        )

        if cached_result:
            # Return cached result directly
            logger.info("Request: Returning cached course recommendations.")
            return CourseRecommendationResponse(**cached_result)

        logger.info("Request: No cache hit, processing request...")

        # First get the skill comparison using the NLP service
        skill_comparison = NLPService.compare_skills_semantic(
            request.resume_text,
            request.job_description_text,
            threshold=request.threshold,
        )

        # Extract all job skills from the skill comparison (both matched and missing)
        # This ensures we have the complete list of job skills with their similarity scores
        all_job_skills = set(
            skill_comparison["matched_skills"] + skill_comparison["missing_skills"]
        )

        # Generate course recommendations using RAG service
        # Pass ALL job skills as ground_truth_skills, not just missing skills
        recommendations = RAGService.generate_course_recommendations(
            request.job_description_text,
            request.resume_text,
            ground_truth_skills=all_job_skills,
        )

        # Implement scoring for each course
        user_skills_set = set(recommendations["user_skills"])
        job_skills_set = set(recommendations["job_skills"])

        # Get the original score
        original_score = skill_comparison["score"]

        # Add score to each recommended course
        for course in recommendations["recommended_courses"]:
            # Extract course skills using NLP service
            course_description = course.get("description", "")
            course_entities = NLPService.extract_distinct_entities_from_all_models(
                course_description
            )
            course_skills = {
                e.text
                for e in course_entities
                if e.label.upper() in ("SKILL", "PRODUCT", "ORG", "GPE", "LANGUAGE")
            }

            # Create enhanced skill set by combining user skills with course skills
            enhanced_skills = user_skills_set.union(course_skills)

            # Calculate new match score with enhanced skills
            enhanced_score_result = SimilarityService.semantic_matching_score(
                job_skills_set, enhanced_skills, threshold=request.threshold
            )

            # Add score to the course object
            course["potential_score"] = enhanced_score_result["score"]
            course["score_improvement"] = max(
                0, enhanced_score_result["score"] - original_score
            )

        # Prepare response data
        response_data = {
            "recommended_courses": recommendations["recommended_courses"],
            "skill_gap": recommendations["skill_gap"],
            "job_skills": recommendations["job_skills"],
            "user_skills": recommendations["user_skills"],
            "recommendations_text": recommendations["recommendations_text"],
            "matching_details": skill_comparison["matching_details"],
        }

        # Cache the result for future requests
        logger.info("Request: Caching result for future requests...")
        cache_success = CacheService.set_course_recommendation(
            request.resume_text,
            request.job_description_text,
            request.threshold,
            response_data,
        )
        logger.info(f"Request: Cache storage success: {cache_success}")

        # Convert the recommendations to the response model
        return CourseRecommendationResponse(**response_data)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating course recommendations: {str(e)}"
        )
