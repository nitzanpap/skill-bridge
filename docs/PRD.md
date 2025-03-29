# Product Requirements Document (PRD)

## ✅ Final PRD — **SkillBridge NLP Server**

Got it — we'll keep it **focused, lean, and clean**. No stretch goals, no repository layer, no scope creep. Just a well-architected server that loads your spaCy models and serves them to the client via API. Here's your **refined PRD**:

---

### 1. **Objective**

Build a backend **Python web server** that:

- Serves custom-trained spaCy NER models via API endpoints
- Allows a frontend to submit text and retrieve named entities
- Follows clean architecture for scalability and clarity
- Is containerized and ready for deployment

---

### 2. **Core Features**

#### 🔹 A. API-Driven Server

- **POST `/analyze`**: Accepts text input and a selected model; returns extracted entities.
- **GET `/models`**: Returns a list of available models in the system.

#### 🔹 B. Multiple spaCy Models Support

- Load models dynamically from the `models/` directory.
- Each model folder (e.g., `ner_model_20000/`) contains a trained spaCy pipeline.

#### 🔹 C. Clean Architecture

Follows modular structure with clear separation of concerns:

- **Controllers (API)**: Handle HTTP routing and requests
- **Services**: Contain all business logic
- **Models (Schemas)**: Define request and response shapes using Pydantic
- **Utils**: Handle internal logic like model loading
- **Core Config**: Central config/env management

#### 🔹 D. Docker Support

- Dockerfile for containerizing the app
- Easy deployment to cloud environments or local testing

---

### 3. **Project Structure**

```sh
skill-bridge/
├── app/
│   ├── main.py              # App entrypoint
│   ├── api/
│   │   └── routes.py        # Defines the routes and their logic
│   ├── services/
│   │   └── nlp_service.py   # Handles NLP processing using spaCy
│   ├── models/
│   │   └── schemas.py       # Request/response Pydantic models
│   ├── core/
│   │   └── config.py        # Reads model paths, env vars
│   └── utils/
│       └── loader.py        # spaCy model loader
├── models/                  # Trained spaCy models live here
├── Dockerfile
├── requirements.txt
├── README.md
└── .env
```

---

### 4. **Endpoints**

#### 🔹 **POST `/analyze`**

**Request:**

```json
{
  "text": "Senior ML Engineer with 5 years at Amazon",
  "model": "ner_model_20000"
}
```

**Response:**

```json
{
  "entities": [
    {"text": "Senior ML Engineer", "label": "ROLE"},
    {"text": "5 years", "label": "EXPERIENCE"},
    {"text": "Amazon", "label": "ORG"}
  ]
}
```

---

#### 🔹 **GET `/models`**

**Response:**

```json
{
  "available_models": [
    "ner_model_20000",
    "ner_model_1000_word2vec",
    "ner_10000_word2vec_glassdoor"
  ]
}
```

---

### 5. **Tech Stack**

| Component        | Tool        |
|------------------|-------------|
| Web Framework    | FastAPI     |
| Language         | Python 3.10 |
| NLP Engine       | spaCy       |
| Server           | Uvicorn     |
| Containerization | Docker      |

---

Let’s start implementing this. Would you like me to generate the full backend skeleton with all files now on a canvas so you can view and tweak it live?
