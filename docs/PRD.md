# Product Requirements Document (PRD) — **SkillBridge**

---

## 1. **Objective**

Build a production-grade, containerized **Python backend server** that:

- Serves **custom-trained spaCy NER models** via REST API endpoints  
- Allows a **frontend client** to submit text and retrieve structured named entities  
- Is structured using **clean architecture principles**  
- Is fully contained inside a `backend/` folder for clarity and separation  
- Uses **FastAPI** for speed, typing, and modern tooling  
- Supports Docker for easy deployment  

---

## 2. **Scope**

This project will **not** include:
- CLI interfaces
- Testing logic or test scripts
- Stretch goals like model evaluation, authentication, or batch uploads
- A repository layer (no DB access needed)

The goal is to **keep it focused, clean, and maintainable**.

---

## 3. **Architecture Overview**

All backend code lives under the `backend/` directory and follows a modular structure based on **clean architecture**:

```
skill-bridge/
├── backend/
│   ├── app/
│   │   ├── main.py              # App entrypoint
│   │   ├── api/
│   │   │   └── routes.py        # HTTP endpoints
│   │   ├── services/
│   │   │   └── nlp_service.py   # Business logic (spaCy inference)
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic request/response schemas
│   │   ├── core/
│   │   │   └── config.py        # Global config/env settings
│   │   └── utils/
│   │       └── loader.py        # spaCy model loading logic
│   ├── models/                  # Local spaCy models (e.g., ner_model_20000/)
│   ├── Dockerfile               # Container definition
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment-specific variables
├── README.md                    # Project instructions
```

---

## 4. **Endpoints**

### 🔹 `POST /analyze`

Processes input text using the specified spaCy NER model and returns extracted entities.

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

### 🔹 `GET /models`

Returns a list of available spaCy model folders found in `backend/models/`.

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

## 5. **Tech Stack**

| Component        | Tool         |
|------------------|--------------|
| Language         | Python 3.10+ |
| Web Framework    | FastAPI      |
| NLP Engine       | spaCy        |
| API Server       | Uvicorn      |
| Dependency Mgmt  | `requirements.txt` |
| Environment Vars | `.env`       |
| Containerization | Docker       |

---

## 6. **Key Principles**

- ✅ **All backend logic is inside `backend/`**
- ✅ **Clean architecture** for future scalability
- ✅ **No CLI or dev-only logic**
- ✅ **Single-responsibility components** (loaders, services, routes)
- ✅ **Container-ready** with Dockerfile
