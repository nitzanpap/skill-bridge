"""
Service for natural language processing tasks.
"""

from typing import List, Optional

from ..models.schemas import Entity
from ..utils.loader import ModelLoader


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
