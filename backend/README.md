# SkillBridge Backend

A production-grade, containerized Python backend server that serves custom-trained spaCy NER models via REST API endpoints. The backend is built with FastAPI and provides a clean architecture for maintainability and future extensions.

## Tech Stack

- **Framework**: FastAPI 0.100.0+ (async Python web framework)
- **ML & Data Science**:
  - spaCy 3.6+ for NER models and language processing
  - sentence-transformers 2.2.2+ for semantic embeddings
  - scikit-learn 1.3+ for similarity metrics and data processing
  - NumPy and Pandas for data manipulation
- **API**: RESTful architecture with JSON schemas
- **Documentation**: Auto-generated OpenAPI/Swagger
- **Language**: Python 3.10+
- **Containerization**: Docker with multi-stage builds
- **Dependency Management**: pip with requirements.txt
- **Testing**: pytest for unit and integration tests
- **Development Tools**:
  - Black for code formatting
  - Flake8 for linting
  - mypy for type checking

## Quick Start

Unix/Linux/Mac:
```bash
# Setup and run without Docker
./setup.sh && ./run.sh

# OR with Docker
docker build -t skillbridge-backend . && docker run -p 8000:8000 skillbridge-backend
```

Windows:
```cmd
# Setup and run without Docker
setup.bat && run.bat

# OR with Docker
docker build -t skillbridge-backend . && docker run -p 8000:8000 skillbridge-backend
```

Then access API at http://localhost:8000/docs

## Features

- Serves custom-trained spaCy NER models via REST API
- Semantic matching of skills using sentence-transformers
- Match scoring between resume and job requirements
- Course recommendation algorithm based on identified skill gaps
- Score improvement predictions for recommended courses
- Built with FastAPI for speed and modern tooling
- Clean architecture principles for maintainability
- Docker support for easy deployment
- Entity extraction from text using custom NER models

## Requirements

- Python 3.10+
- Docker (optional, for containerized deployment)
- 4GB+ RAM for running NLP models
- 2GB+ disk space for models and dependencies

### Python Dependencies

The main dependencies include:
- FastAPI: Web framework
- Uvicorn: ASGI server
- spaCy: NLP framework
- sentence-transformers: Embeddings for semantic search
- scikit-learn: Machine learning utilities
- Pydantic: Data validation
- python-dotenv: Environment variable management

## Setup

### Prerequisites

Before installation, verify your Python version:

```bash
python --version  # Should be 3.10 or higher
```

### Local Development (Without Docker)

1. Clone the repository and navigate to the backend directory:

```bash
git clone https://github.com/yourusername/skill-bridge.git
cd skill-bridge/backend
```

2. Run the setup script which creates a virtual environment and installs dependencies:

Unix/Linux/Mac:
```bash
./setup.sh
```

Windows:
```cmd
setup.bat
```

Or manually:

Unix/Linux/Mac:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Windows:
```cmd
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

3. Make sure your spaCy models are in the `models/` directory.

4. Configure environment variables by creating a `.env` file:

```
MODELS_DIR=./models
DEFAULT_MODEL=ner_model_20000
ALLOWED_ORIGINS=*
```

### Docker Setup

1. Build the Docker image:

```bash
docker build -t skillbridge-backend .
```

2. Run the Docker container:

```bash
docker run -p 8000:8000 skillbridge-backend
```

For development with mounted volumes (to reflect code changes):

```bash
docker run -p 8000:8000 -v $(pwd):/app skillbridge-backend
```

## Usage

### Starting the Server

Run the server using the provided script:

Unix/Linux/Mac:
```bash
./run.sh
```

Windows:
```cmd
run.bat
```

Or manually:

Unix/Linux/Mac:
```bash
source .venv/bin/activate
python -m app.main
```

Windows:
```cmd
.venv\Scripts\activate
python -m app.main
```

### Performance Considerations

- spaCy models can be memory-intensive. For production deployments, consider using a machine with at least 4GB RAM.
- The first request may be slow as models are loaded into memory. Subsequent requests will be faster.
- For high-traffic applications, consider scaling horizontally with multiple containers behind a load balancer.

### API Endpoints

#### Semantic Skill Comparison

```
POST /api/v1/compare-skills/semantic
```

Request:
```json
{
  "resume_text": "Machine learning engineer with 5 years of Python experience",
  "job_description_text": "Looking for an ML expert with deep experience in Python programming",
  "threshold": 0.5
}
```

Response:
```json
{
  "score": 85.5,
  "matched_skills": ["Machine learning", "Python"],
  "missing_skills": ["deep learning"],
  "matching_details": [
    {
      "job_skill": "ML",
      "best_match": "Machine learning",
      "similarity": 0.89,
      "is_match": true
    },
    {
      "job_skill": "Python programming",
      "best_match": "Python",
      "similarity": 0.92,
      "is_match": true
    },
    {
      "job_skill": "deep learning",
      "best_match": "Machine learning",
      "similarity": 0.45,
      "is_match": false
    }
  ]
}
```

This endpoint extracts skills from both the resume and job description using NER, then compares them semantically using sentence transformers to identify matches even when terms aren't exactly the same (e.g., "ML" and "Machine Learning").

#### Course Recommendations

```
POST /api/v1/recommend-courses
```

Request:
```json
{
  "skill_gap": ["deep learning", "TensorFlow", "PyTorch"],
  "current_score": 65.0
}
```

Response:
```json
{
  "recommended_courses": [
    {
      "course_name": "Deep Learning Specialization",
      "description": "Learn the foundations of Deep Learning, understand how to build neural networks, and learn how to lead successful machine learning projects.",
      "url": "https://www.coursera.org/specializations/deep-learning",
      "potential_score": 85.5,
      "score_improvement": 20.5
    },
    {
      "course_name": "PyTorch for Deep Learning",
      "description": "Learn the basics of deep learning and PyTorch, and build your first neural networks.",
      "url": "https://www.udemy.com/course/pytorch-for-deep-learning",
      "potential_score": 78.0,
      "score_improvement": 13.0
    }
  ],
  "skill_gap": ["deep learning", "TensorFlow", "PyTorch"]
}
```

This endpoint takes a list of missing skills and the current job match score, then recommends courses to help close the skill gap along with predicted score improvements.

#### Analyze Text

```
POST /api/v1/analyze
```

Request:
```json
{
  "text": "Senior ML Engineer with 5 years at Amazon",
  "model": "ner_model_20000"
}
```

Response:
```json
{
  "entities": [
    {"text": "Senior ML Engineer", "label": "ROLE"},
    {"text": "5 years", "label": "EXPERIENCE"},
    {"text": "Amazon", "label": "ORG"}
  ]
}
```

#### Analyze Text with All Models

```
POST /api/v1/analyze/all
```

Request:
```json
{
  "text": "Senior ML Engineer with 5 years at Amazon"
}
```

Response:
```json
{
  "entities": [
    {"text": "Senior ML Engineer", "label": "ROLE"},
    {"text": "5 years", "label": "EXPERIENCE"},
    {"text": "Amazon", "label": "ORG"},
    {"text": "ML Engineer", "label": "SKILL"}
  ]
}
```

#### List Available Models

```
GET /api/v1/models
```

Response:
```json
{
  "available_models": [
    "ner_model_20000",
    "ner_model_1000_word2vec",
    "ner_10000_word2vec_glassdoor"
  ]
}
```

### API Documentation

Once the server is running, you can access the automatic API documentation at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── main.py              # App entrypoint
│   ├── api/
│   │   └── routes.py        # HTTP endpoints
│   ├── services/
│   │   ├── nlp_service.py   # Business logic (spaCy inference)
│   │   ├── similarity_service.py   # Semantic similarity computation
│   │   └── recommendation_service.py   # Course recommendation algorithm
│   ├── models/
│   │   └── schemas.py       # Pydantic request/response schemas
│   ├── core/
│   │   └── config.py        # Global config/env settings
│   └── utils/
│       └── loader.py        # spaCy model loading logic
├── models/                  # Local spaCy models
├── Dockerfile               # Container definition
├── requirements.txt         # Python dependencies
└── .env                     # Environment-specific variables
```

## Environment Variables

Configure the application by setting the following environment variables in the `.env` file:

- `MODELS_DIR`: Directory containing the spaCy models (default: `./models`)
- `DEFAULT_MODEL`: Default model to use when none is specified (default: `ner_model_20000`)
- `ALLOWED_ORIGINS`: CORS allowed origins (default: `*`) 
- `COURSE_API_KEY`: API key for accessing course data (if applicable)
