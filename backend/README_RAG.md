# Course Recommendation RAG System

This document explains the Retrieval-Augmented Generation (RAG) system implemented for recommending courses based on the skill gap between job requirements and a user's resume.

## Overview

The RAG system combines vector search and large language models to provide personalized course recommendations:

1. **Vector Search**: We use Pinecone to store and search for relevant courses based on the job description
2. **Skill Gap Analysis**: The system identifies the skills mentioned in the job that are missing from the resume
3. **LLM Generation**: We use Cohere to generate tailored course recommendations that address the specific skill gaps

## Setup Instructions

### Prerequisites

- Python 3.8+
- A Pinecone API key (free tier available at [pinecone.io](https://www.pinecone.io/))
- A Cohere API key (free tier available at [cohere.com](https://cohere.com/))
- Course dataset in CSV format

### Environment Configuration

1. Copy the example environment file:
   ```
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```
   PINECONE_API_KEY=your-pinecone-api-key
   COHERE_API_KEY=your-cohere-api-key
   ```

3. Configure the path to your course dataset:
   ```
   COURSES_DATASET_PATH=path/to/your/courses.csv
   ```

### Building the Course Index

Before using the RAG system, you need to build and index the course database:

```bash
python app/build_course_index.py --file_path path/to/courses.csv
```

This script will:
- Load the course data from the CSV file
- Preprocess and clean the data
- Generate embeddings for each course using sentence-transformers
- Upload the embeddings to Pinecone for fast vector search

## API Usage

### Course Recommendation Endpoint

```
POST /api/v1/recommend-courses
```

Request body:
```json
{
  "resume_text": "Full text of the resume",
  "job_description_text": "Full text of the job description",
  "threshold": 0.5
}
```

Response:
```json
{
  "recommended_courses": [
    {
      "course_name": "Introduction to Python",
      "url": "https://example.com/python-course",
      "description": "Learn Python programming from scratch"
    }
  ],
  "skill_gap": ["Python", "Machine Learning", "Data Analysis"],
  "job_skills": ["Python", "Machine Learning", "Data Analysis", "Communication"],
  "user_skills": ["Communication"],
  "recommendations_text": "Full text of the generated recommendations"
}
```

## System Architecture

The RAG system consists of the following components:

1. **Embedding Utilities**: Functions for loading, preprocessing, embedding, and indexing course data
2. **RAG Service**: Core service that handles the recommendation process
3. **API Routes**: FastAPI endpoint for interacting with the service

### Flow Diagram

```
Resume + Job Description
         │
         ▼
  ┌───────────────┐
  │ Extract Skills │
  └───────────────┘
         │
         ▼
  ┌───────────────┐
  │ Identify Gap  │
  └───────────────┘
         │
         ▼
  ┌───────────────┐
  │ Vector Search │───┐
  └───────────────┘   │
         │            │
         ▼            │
  ┌───────────────┐   │
  │  LLM Prompt   │◄──┘
  └───────────────┘
         │
         ▼
  ┌───────────────┐
  │   Courses +   │
  │ Explanations  │
  └───────────────┘
```

## Course Dataset Format

The expected CSV format for the course dataset is:

```
Title,Category,Sub-Category,Short Intro,Skills,url
"Python for Beginners","Programming","Python","Learn Python from scratch","Python, Programming",https://example.com/python
```

## Troubleshooting

- **Missing Dependencies**: Ensure all required packages are installed via `pip install -r requirements.txt`
- **API Key Issues**: Verify your Pinecone and Cohere API keys are correct
- **Index Creation Failures**: Check Pinecone account limits and permissions
- **Embedding Errors**: Make sure your course data is properly formatted and contains valid text 
