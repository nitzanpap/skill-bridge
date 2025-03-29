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
    def list_models() -> List[str]:
        """
        List all available NER models.

        Returns:
            List of model names
        """
        return ModelLoader.list_available_models()
