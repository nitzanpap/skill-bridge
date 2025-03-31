#!/usr/bin/env python
"""
Test script to verify spaCy model compatibility with installed spaCy version.
"""

import os
import sys
from pathlib import Path

import spacy


def main():
    # Print spaCy version for verification
    print(f"Using spaCy version: {spacy.__version__}")

    # Get models directory
    models_dir = os.environ.get("MODELS_DIR", "./models")

    # List available models
    try:
        models = [
            item.name
            for item in Path(models_dir).iterdir()
            if item.is_dir() and (item / "config.cfg").exists()
        ]

        print(f"Found {len(models)} models: {models}")

        # Try to load each model
        for model_name in models:
            model_path = Path(models_dir) / model_name
            print(f"Loading model: {model_name} from {model_path}")

            # Load the model
            nlp = spacy.load(model_path)

            # Test with a sample text
            doc = nlp("Software Engineer with Python, JavaScript and Docker experience")

            # Print entities
            entities = [(ent.text, ent.label_) for ent in doc.ents]
            print(f"Detected entities: {entities}")
            print(f"Model {model_name} loaded successfully!")
            print("-" * 50)

    except Exception as e:
        print(f"Error: {e}")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
