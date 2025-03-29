"""
Utility class for loading and caching spaCy models.
"""

from pathlib import Path
from typing import Dict, Optional

import spacy

from ..core.config import DEFAULT_MODEL, MODELS_DIR


class ModelLoader:
    """Utility class for loading and caching spaCy models."""

    _models: Dict[str, spacy.language.Language] = {}

    @classmethod
    def get_model(cls, model_name: Optional[str] = None) -> spacy.language.Language:
        """
        Load a spaCy model by name, or return a cached instance if already loaded.

        Args:
            model_name: Name of the model to load. If None, uses the default model.

        Returns:
            A loaded spaCy model

        Raises:
            ValueError: If the model doesn't exist
        """
        model_name = model_name or DEFAULT_MODEL

        # Return cached model if available
        if model_name in cls._models:
            return cls._models[model_name]

        # Construct model path
        model_path = Path(MODELS_DIR) / model_name

        if not model_path.exists():
            raise ValueError(f"Model '{model_name}' not found in {MODELS_DIR}")

        # Load the model
        nlp = spacy.load(model_path)

        # Cache the model
        cls._models[model_name] = nlp

        return nlp

    @classmethod
    def list_available_models(cls) -> list[str]:
        """
        List all available models in the models directory.

        Returns:
            List of model names
        """
        try:
            # Get all subdirectories in the models directory
            return [
                item.name
                for item in Path(MODELS_DIR).iterdir()
                if item.is_dir() and (item / "config.cfg").exists()
            ]
        except Exception as e:
            print(f"Error listing models: {e}")
            return []
