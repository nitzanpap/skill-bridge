"""
API routes for the Skill Bridge application.
"""

from fastapi import APIRouter, HTTPException

from ..models.schemas import (
    CourseRecommendationRequest,
    CourseRecommendationResponse,
)
from ..services.nlp_service import NLPService
from ..services.rag_service import RAGService

# Create router instance
router = APIRouter()


@router.post("/recommend-courses", response_model=CourseRecommendationResponse)
async def recommend_courses(request: CourseRecommendationRequest):
    """
    Recommend courses based on skill gap between resume and job description.

    This endpoint performs:
    1. Named entity extraction to identify skills in both the resume and job description
    2. Calculation of the skill gap between the two
    3. Retrieval of relevant course data using vector similarity search
    4. LLM-based generation of course recommendations tailored to the skill gap
    5. Processing of LLM outputs to provide structured course recommendations with URLs
    6. Returns detailed skill matching information with similarity scores
    """
    try:
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

        # Convert the recommendations to the response model
        return CourseRecommendationResponse(
            recommended_courses=recommendations["recommended_courses"],
            skill_gap=recommendations["skill_gap"],
            job_skills=recommendations["job_skills"],
            user_skills=recommendations["user_skills"],
            recommendations_text=recommendations["recommendations_text"],
            matching_details=skill_comparison["matching_details"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating course recommendations: {str(e)}"
        )
