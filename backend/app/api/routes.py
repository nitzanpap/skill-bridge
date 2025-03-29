"""
API routes for the Skill Bridge application.
"""

from fastapi import APIRouter, HTTPException

from ..models.schemas import (
    CourseRecommendationRequest,
    CourseRecommendationResponse,
    SemanticSkillComparisonRequest,
    SemanticSkillComparisonResponse,
)
from ..services.nlp_service import NLPService
from ..services.rag_service import RAGService

# Create router instance
router = APIRouter()


@router.post("/compare-skills/semantic", response_model=SemanticSkillComparisonResponse)
async def compare_skills_semantic(request: SemanticSkillComparisonRequest):
    """
    Compare skills between resume and job description using semantic similarity.
    Returns a score and detailed matching information.

    This endpoint performs:
    1. Named entity extraction from both resume and job description
    2. Semantic similarity comparison between skills using sentence transformers
    3. Calculation of an overall match score for the applicant
    """
    try:
        result = NLPService.compare_skills_semantic(
            request.resume_text,
            request.job_description_text,
            threshold=request.threshold,
        )
        return SemanticSkillComparisonResponse(
            score=result["score"],
            matched_skills=result["matched_skills"],
            missing_skills=result["missing_skills"],
            matching_details=result["matching_details"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing request: {str(e)}"
        )


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
    """
    try:
        # First get the skill gap using the NLP service
        skill_comparison = NLPService.compare_skills_semantic(
            request.resume_text,
            request.job_description_text,
            threshold=request.threshold,
        )

        # Convert missing skills to set for RAG service
        missing_skills = set(skill_comparison["missing_skills"])

        # Generate course recommendations using RAG service
        recommendations = RAGService.generate_course_recommendations(
            request.job_description_text,
            request.resume_text,
            ground_truth_skills=missing_skills,
        )

        # Convert the recommendations to the response model
        return CourseRecommendationResponse(
            recommended_courses=recommendations["recommended_courses"],
            skill_gap=recommendations["skill_gap"],
            job_skills=recommendations["job_skills"],
            user_skills=recommendations["user_skills"],
            recommendations_text=recommendations["recommendations_text"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating course recommendations: {str(e)}"
        )
