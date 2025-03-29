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


class CombinedAnalysisRequest(BaseModel):
    """Request schema for combined text analysis across all models."""

    text: str = Field(..., description="The text to analyze")


class CombinedAnalysisResponse(BaseModel):
    """Response schema for combined text analysis results from all models."""

    entities: List[Entity] = Field(
        default_factory=list,
        description="List of distinct extracted entities from all models",
    )


class CompareSkillsRequest(BaseModel):
    """Request schema for comparing resume skills against job requirements."""

    resume_text: str = Field(..., description="The resume text to analyze")
    job_description_text: str = Field(
        ..., description="The job description text to analyze"
    )


class SkillComparisonResponse(BaseModel):
    """Response schema for skill comparison results."""

    resume_skills: List[Entity] = Field(
        default_factory=list,
        description="Skills found in the resume",
    )
    job_skills: List[Entity] = Field(
        default_factory=list, description="Skills required by the job"
    )
    missing_skills: List[Entity] = Field(
        default_factory=list,
        description="Skills in the job description but not in the resume",
    )


class ModelsResponse(BaseModel):
    """Response schema for available models."""

    available_models: List[str] = Field(
        default_factory=list, description="List of available model names"
    )
