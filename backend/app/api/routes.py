"""
API routes for the Skill Bridge application.
"""

from fastapi import APIRouter, HTTPException

from ..models.schemas import (
    SemanticSkillComparisonRequest,
    SemanticSkillComparisonResponse,
)
from ..services.nlp_service import NLPService

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
