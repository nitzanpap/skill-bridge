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

## Core Components

- Advanced NER pipeline for skill identification
- Semantic matching using sentence transformers
- Comprehensive evaluation tools and metrics
- Course recommendation engine with score improvement calculations
- Modern, responsive UI with light/dark mode support

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
