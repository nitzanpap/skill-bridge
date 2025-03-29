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
- 📈 **Job Prioritization**: Rank potential jobs based on user's current skill proximity
- 📘 **Course Recommendations**: Suggest the most relevant courses to acquire missing skills

## Core Components

- Advanced NER pipeline for skill identification
- Semantic matching using sentence transformers
- Comprehensive evaluation tools and metrics
- Detailed job and course profiling algorithms
- Infrastructure for comparison, clustering, and visualization

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

### Frontend

```bash
cd client
npm install
npm run dev
```

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

## Technical Architecture

- **Backend**: FastAPI server with spaCy NER models and sentence-transformers for semantic similarity
- **Frontend**: Next.js application with a modern UI for visualizing skill matches
- **API**: RESTful endpoints for skill extraction and comparison

## Impact

This project directly addresses workforce development challenges by:

- Providing clear pathways for career advancement
- Optimizing training and education investments
- Reducing skill mismatches in the job market
- Empowering users with actionable insights for professional development
