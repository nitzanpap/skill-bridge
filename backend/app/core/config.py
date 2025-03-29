"""
Global configuration for the Skill Bridge application.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API settings
API_V1_STR = "/api/v1"
PROJECT_NAME = "SkillBridge"

# Path settings
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODELS_DIR = os.environ.get("MODELS_DIR", str(BASE_DIR / "models"))
ASSETS_DIR = Path(os.environ.get("ASSETS_DIR", str(BASE_DIR / "assets")))

# Default model
DEFAULT_MODEL = os.environ.get("DEFAULT_MODEL", "ner_model_20000")

# CORS settings
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

# RAG service settings
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY", "")
PINECONE_INDEX_NAME = os.environ.get("PINECONE_INDEX_NAME", "course-index-prod")
COHERE_API_KEY = os.environ.get("COHERE_API_KEY", "")

# Dataset settings
COURSES_DATASET_PATH = os.environ.get(
    "COURSES_DATASET_PATH", str(ASSETS_DIR / "online_courses.csv")
)
