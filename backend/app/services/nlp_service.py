"""
Service for natural language processing tasks.
"""

from typing import List, Optional

from ..models.schemas import Entity
from ..utils.loader import ModelLoader
from .similarity_service import SimilarityService


class NLPService:
    """Service for natural language processing tasks."""

    @staticmethod
    def extract_entities(text: str, model_name: Optional[str] = None) -> List[Entity]:
        """
        Extract named entities from text using spaCy.

        Args:
            text: The input text to analyze
            model_name: The name of the model to use

        Returns:
            List of extracted entities
        """
        # Get the model
        nlp = ModelLoader.get_model(model_name)

        # Process the text
        doc = nlp(text)

        # Extract entities
        entities = [Entity(text=ent.text, label=ent.label_) for ent in doc.ents]

        return entities

    @staticmethod
    def extract_distinct_entities_from_all_models(text: str) -> List[Entity]:
        """
        Extract named entities from text using all available models and return a distinct set.

        Args:
            text: The input text to analyze

        Returns:
            List of distinct extracted entities from all models
        """
        # Get all available models
        models = ModelLoader.list_available_models()

        # Track all found entities
        all_entities = []

        # Process text with each model
        for model_name in models:
            entities = NLPService.extract_entities(text, model_name)
            all_entities.extend(entities)

        # Create a set to store unique entities (text and label combination)
        unique_entities = set()
        distinct_entities = []

        # Filter to get distinct entities only
        for entity in all_entities:
            entity_tuple = (entity.text, entity.label)
            if entity_tuple not in unique_entities:
                unique_entities.add(entity_tuple)
                distinct_entities.append(entity)

        return distinct_entities

    @staticmethod
    def list_models() -> List[str]:
        """
        List all available NER models.

        Returns:
            List of model names
        """
        return ModelLoader.list_available_models()

    @staticmethod
    def compare_skills_semantic(
        resume_text: str, job_description_text: str, threshold: float = 0.5
    ) -> dict:
        """
        Compare skills between resume and job description using semantic similarity.

        Args:
            resume_text: The resume text to analyze
            job_description_text: The job description text to analyze
            threshold: Similarity threshold for considering skills as a match

        Returns:
            Dictionary containing score, matched skills, missing skills, and matching details
        """
        # Extract skills from both texts using all models
        resume_entities = NLPService.extract_distinct_entities_from_all_models(
            resume_text
        )
        job_entities = NLPService.extract_distinct_entities_from_all_models(
            job_description_text
        )

        # Filter for skills only
        resume_skills = [
            e.text
            for e in resume_entities
            if e.label.upper() in ("SKILL", "PRODUCT", "ORG", "GPE", "LANGUAGE")
        ]
        job_skills = [
            e.text
            for e in job_entities
            if e.label.upper() in ("SKILL", "PRODUCT", "ORG", "GPE", "LANGUAGE")
        ]

        # Convert to sets to remove duplicates
        resume_skills_set = set(resume_skills)
        job_skills_set = set(job_skills)

        # Use similarity service to compute match score
        result = SimilarityService.semantic_matching_score(
            job_skills_set, resume_skills_set, threshold=threshold
        )

        return result
