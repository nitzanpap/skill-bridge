# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Skill Bridge is an AI-powered recommendation engine that helps job seekers identify skill gaps between their resume and job descriptions, then recommends targeted upskilling courses. It uses custom NLP models for skill extraction and semantic matching to provide personalized course recommendations with quantified match score improvements.

## Architecture

### Frontend (client/)
- **Stack**: Next.js 15+ with React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Deployment**: Vercel (automatic from main branch)
- **Key features**: Animated processing modal, light/dark theme, responsive design

### Backend (backend/)
- **Stack**: FastAPI (Python 3.10+), spaCy, sentence-transformers, Pinecone, Cohere
- **ML Models**: 3 custom-trained spaCy NER models for skill extraction
- **Deployment**: Docker containers (Railway-ready)
- **Package Manager**: uv (modern Python package manager)

## Development Commands

### Frontend Development
```bash
cd client
npm install
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

### Backend Development
The backend is designed to run through Docker:
```bash
cd backend
docker build -t skill-bridge-backend .
docker run -p 8000:8000 -v $(pwd):/app skill-bridge-backend  # Dev with hot reload
```

### Full Stack Development
From project root:
```bash
docker-compose up -d          # Start both services
docker-compose up -d --build  # Rebuild and start
docker-compose logs -f        # View logs
docker-compose down           # Stop all services
```

## Key API Endpoints

- `POST /api/v1/recommend-courses` - Main endpoint for skill gap analysis and course recommendations
- `POST /api/v1/compare-skills/semantic` - Semantic skill comparison
- `POST /api/v1/analyze` - Text analysis with NER
- `GET /api/v1/models` - List available NER models

## Processing Pipeline

The skill analysis pipeline takes 45-74 seconds total:
1. Data validation (1-2s)
2. Named Entity Recognition with 3 spaCy models (10-20s)
3. Skill extraction & filtering (2-5s)
4. Semantic similarity analysis using SentenceTransformer (15-25s)
5. RAG course retrieval from Pinecone (10-20s)
6. LLM course recommendation via Cohere (5-15s)
7. Final scoring (2-5s)

## Important Configuration

### Backend Environment Variables
- `MODELS_DIR` - Directory containing spaCy models
- `DEFAULT_MODEL` - Default NER model to use
- `ALLOWED_ORIGINS` - CORS origins
- `PINECONE_API_KEY` - Vector database access
- `COHERE_API_KEY` - LLM API access

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL` - Primary backend URL
- `NEXT_PUBLIC_BACKUP_API_URL` - Fallback backend URL

## Code Architecture Patterns

### Frontend
- Components organized by feature in `components/`
- Custom hooks in `hooks/` for business logic
- API client with automatic fallback in `lib/api.ts`
- UI components from shadcn/ui in `components/ui/`

### Backend
- Clean architecture with separation of concerns:
  - `api/` - FastAPI route handlers
  - `services/` - Business logic (NLP, RAG, similarity)
  - `models/` - Pydantic schemas
  - `utils/` - Shared utilities
- Request caching with DiskCache for performance
- Modular service design for easy testing and extension

## Testing Approach

Currently limited test coverage. When adding tests:
- Frontend: Use React Testing Library with Jest
- Backend: Use pytest with FastAPI test client
- Run backend tests: `uv run pytest`

## Performance Considerations

- Backend requires 4GB+ RAM for ML models
- Request caching implemented to reduce redundant processing
- Frontend uses React.memo and custom hooks for optimization
- Docker deployment ensures consistent performance across environments

## Repository URL
https://github.com/nitzanpap/skill-bridge