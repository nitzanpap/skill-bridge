# SkillBridge Backend

A production-grade, containerized Python backend server that serves custom-trained spaCy NER models via REST API endpoints. The backend is built with FastAPI and provides a clean architecture for maintainability and future extensions.

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
- Built with FastAPI for speed and modern tooling
- Clean architecture principles for maintainability
- Docker support for easy deployment
- Entity extraction from text using custom NER models

## Requirements

- Python 3.10+
- Docker (optional, for containerized deployment)

## Setup

### Local Development (Without Docker)

1. Clone the repository and navigate to the backend directory:

```bash
cd backend
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

### Docker Setup

1. Build the Docker image:

```bash
docker build -t skillbridge-backend .
```

2. Run the Docker container:

```bash
docker run -p 8000:8000 skillbridge-backend
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

### API Endpoints

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
│   │   └── nlp_service.py   # Business logic (spaCy inference)
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
