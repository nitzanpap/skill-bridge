# Skill Bridge

## Description

🎯 Skill Bridge is a recommendation engine that identifies skill gaps between job seekers and job requirements, then suggests targeted upskilling courses to improve job match scores. By bridging the gap between user skills and job requirements, we help candidates become more competitive for their desired positions.

## Features

- 📄 **Skill Extraction**: Automatically extract required skills from job descriptions using NER (Named Entity Recognition)
- 👤 **Profile Analysis**: Process user profiles to identify existing skills and competencies
- 📚 **Job Matching**: Match users to relevant jobs based on skill compatibility using various metrics
- 🔍 **Gap Analysis**: Quantify and visualize skill gaps between candidates and job requirements
- 🧠 **Semantic Matching**: Compare skills semantically using state-of-the-art sentence transformers (e.g., "ML" matches with "Machine Learning")
- 🎯 **Match Scoring**: Calculate an overall match score between resume and job description to help candidates assess their fit
- 📘 **Course Recommendations**: Suggest the most relevant courses to acquire missing skills with potential score improvement metrics

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (React framework)
- **UI Libraries**: 
  - Tailwind CSS for styling
  - Shadcn UI for component library
  - Lucide React for icons
- **Language**: TypeScript
- **State Management**: React Context API
- **API Integration**: Fetch API
- **Build Tools**: Node.js 18+, npm/yarn/pnpm

### Backend
- **Framework**: FastAPI (Python web framework)
- **Machine Learning**:
  - spaCy for NER models
  - sentence-transformers for semantic matching
  - scikit-learn for similarity metrics
- **Language**: Python 3.10+
- **Containerization**: Docker
- **API Documentation**: Swagger UI / ReDoc (auto-generated)

## Core Components

- Advanced NER pipeline for skill identification
- Semantic matching using sentence transformers
- Comprehensive evaluation tools and metrics
- Course recommendation engine with score improvement calculations
- Modern, responsive UI with light/dark mode support

## Installation & Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm, yarn, or pnpm
- Docker (optional, for containerized deployment)

### Backend

```bash
# Clone the repository (if not done already)
git clone https://github.com/yourusername/skill-bridge.git
cd skill-bridge

# Setup environment and install dependencies
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run the server
python -m app.main
```

With Docker:
```bash
cd backend
docker build -t skillbridge-backend .
docker run -p 8000:8000 skillbridge-backend
```

The API will be available at http://localhost:8000 with documentation at http://localhost:8000/docs

### Frontend

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install
# or: yarn install
# or: pnpm install

# Configure environment
# Create a file named .env.local with:
# NEXT_PUBLIC_API_URL='http://localhost:8000'

# Run the development server
npm run dev
# or: yarn dev
# or: pnpm dev
```

The application will be available at http://localhost:3000

See the README files in the backend and client directories for more detailed setup instructions.

## Usage

The application provides a simple web interface where you can:

1. Paste your resume text
2. Paste a job description
3. Adjust the similarity threshold for matching
4. Get a comprehensive analysis including:
   - Overall match score
   - Matched skills
   - Missing skills 
   - Detailed similarity breakdown for each skill
   - Course recommendations to bridge your skill gap
   - Score improvement predictions for each recommended course

## Technical Architecture

- **Backend**: FastAPI server with spaCy NER models and sentence-transformers for semantic similarity
- **Frontend**: Next.js application with React, Tailwind CSS, and Shadcn UI components
- **API**: RESTful endpoints for skill extraction, comparison, and course recommendations

## Impact

This project directly addresses workforce development challenges by:

- Providing clear pathways for career advancement through targeted course recommendations
- Optimizing training and education investments by focusing on high-impact skills
- Reducing skill mismatches in the job market
- Empowering users with actionable insights for professional development
- Quantifying potential improvements in job match scores through recommended courses
