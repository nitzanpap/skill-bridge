"""
API routes for the Skill Bridge application.
"""

from fastapi import APIRouter, HTTPException

from ..models.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    CombinedAnalysisRequest,
    CombinedAnalysisResponse,
    ModelsResponse,
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
