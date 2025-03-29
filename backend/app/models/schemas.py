"""
Schemas for the Skill Bridge application.
"""

from typing import List, Optional

from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    """Request schema for text analysis."""

    text: str = Field(..., description="The text to analyze")
    model: Optional[str] = Field(None, description="The name of the model to use")


class Entity(BaseModel):
    """Schema for a named entity."""

    text: str = Field(..., description="The entity text")
    label: str = Field(..., description="The entity label")


class AnalysisResponse(BaseModel):
    """Response schema for text analysis result."""

    entities: List[Entity] = Field(
        default_factory=list, description="List of extracted entities"
    )


class ModelsResponse(BaseModel):
    """Response schema for available models."""

    available_models: List[str] = Field(
        default_factory=list, description="List of available model names"
    )
