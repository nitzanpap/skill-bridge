"""
API routes for the Skill Bridge application.
"""

from fastapi import APIRouter, HTTPException

from ..models.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    CombinedAnalysisRequest,
    CombinedAnalysisResponse,
    CompareSkillsRequest,
    ModelsResponse,
    SkillComparisonResponse,
)
from ..services.nlp_service import NLPService

# Create router instance
router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    """
    Analyze text for named entities using spaCy.
    """
    try:
        entities = NLPService.extract_entities(request.text, request.model)
        return AnalysisResponse(entities=entities)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing request: {str(e)}"
        )


@router.post("/analyze/all", response_model=CombinedAnalysisResponse)
async def analyze_text_all_models(request: CombinedAnalysisRequest):
    """
    Analyze text using all available models and return distinct entities.
    """
    try:
        entities = NLPService.extract_distinct_entities_from_all_models(request.text)
        return CombinedAnalysisResponse(entities=entities)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing request: {str(e)}"
        )


@router.get("/models", response_model=ModelsResponse)
async def list_models():
    """
    List all available models.
    """
    models = NLPService.list_models()
    return ModelsResponse(available_models=models)


@router.post("/compare-skills", response_model=SkillComparisonResponse)
async def compare_skills(request: CompareSkillsRequest):
    """
    Compare skills between resume and job description.
    """
    try:
        result = NLPService.compare_skills(
            request.resume_text, request.job_description_text
        )
        return SkillComparisonResponse(
            resume_skills=result["resume_skills"],
            job_skills=result["job_skills"],
            missing_skills=result["missing_skills"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing request: {str(e)}"
        )
