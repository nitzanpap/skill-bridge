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
- **Dependency Management**: uv (fast Python package installer and resolver)
- **Testing**: pytest for unit and integration tests
- **Development Tools**:
  - Black for code formatting
  - Flake8 for linting
  - mypy for type checking

## Quick Start

```bash
# Build the Docker image
docker build -t skillbridge-backend .

# Run the Docker container
docker run -p 8000:8000 skillbridge-backend
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
- uv (Python package installer and resolver)
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

Dependencies are managed using `uv` for improved performance and reliability.

## Setup

### Prerequisites

- Docker (for containerized deployment)
- Python 3.10+ (for local development)
- uv (for dependency management)

#### Installing Python

**For macOS/Linux:**
```bash
# Install pyenv (Python version manager)
curl https://pyenv.run | bash

# Add to your shell profile
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc  # or ~/.zshrc if using zsh

# Install Python 3.10
pyenv install 3.10

# Set global Python version
pyenv global 3.10

# Verify installation
python --version
```

**For Windows:**
1. Download Python 3.10 installer from [python.org](https://www.python.org/downloads/)
2. Run the installer and check "Add Python to PATH"
3. Verify installation by opening Command Prompt and running `python --version`

#### Installing uv

uv is a fast Python package installer and resolver. Here's how to install it:

**For macOS/Linux:**
```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Verify installation
uv --version
```

**For Windows:**
```cmd
# Using PowerShell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Verify installation
uv --version
```

### Option 1: Docker Setup (Recommended)

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

### Option 2: Local Development Setup

1. Clone the repository and navigate to the backend directory:

```bash
git clone https://github.com/yourusername/skill-bridge.git
cd skill-bridge/backend
```

2. Create a virtual environment:

```bash
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On macOS/Linux
source .venv/bin/activate
# On Windows
.venv\Scripts\activate
```

3. Install dependencies using uv:

```bash
# Install dependencies
uv pip install -r requirements.txt

# Or, if you want to use the pyproject.toml
uv pip install -e .
```

4. Configure environment variables by creating a `.env` file:

```
MODELS_DIR=./models
DEFAULT_MODEL=ner_model_20000
ALLOWED_ORIGINS=*
```

5. Start the development server:

```bash
# Run the backend server
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000 with documentation at http://localhost:8000/docs

## Usage

The backend server is automatically started when the Docker container is run using the command:

```bash
docker run -p 8000:8000 skillbridge-backend
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

## Troubleshooting

### Common Issues and Solutions

#### Docker Issues

1. **Docker container fails to start**:
   ```
   Error: Couldn't connect to Docker daemon
   ```
   - Make sure Docker Desktop is running
   - Try running Docker Desktop as administrator/with sudo

2. **Port already in use**:
   ```
   Error: Bind for 0.0.0.0:8000 failed: port is already allocated
   ```
   - Another application is using port 8000
   - Change the port when running Docker: `docker run -p 8001:8000 skillbridge-backend`
   - Then access the API at http://localhost:8001/docs

3. **Container exits immediately**:
   - Check logs with `docker logs [container_id]`
   - Ensure your Dockerfile has the correct CMD command

#### Python Environment Issues

1. **Python module not found**:
   ```
   ModuleNotFoundError: No module named 'fastapi'
   ```
   - Make sure you're in the activated virtual environment
   - Reinstall dependencies: `uv pip install -r requirements.txt`

2. **spaCy models not loading**:
   - Ensure model files are in the correct directory
   - Set the correct MODELS_DIR in your .env file

3. **uv command not found**:
   - Make sure uv is installed and in your PATH
   - Install uv following the instructions in Prerequisites

### Getting Help

If you encounter issues not covered here, check:
1. The project's GitHub issues section
2. FastAPI documentation: https://fastapi.tiangolo.com/
3. Docker documentation: https://docs.docker.com/

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
