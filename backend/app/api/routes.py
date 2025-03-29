"""
API routes for the Skill Bridge application.
"""

from fastapi import APIRouter, HTTPException

from ..models.schemas import AnalysisRequest, AnalysisResponse, ModelsResponse
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


@router.get("/models", response_model=ModelsResponse)
async def list_models():
    """
    List all available models.
    """
    models = NLPService.list_models()
    return ModelsResponse(available_models=models)
