# Course Recommendation Feature - Frontend

This document explains how to use the course recommendation feature in the Skill Bridge frontend application.

## Overview

The course recommendation feature uses Retrieval-Augmented Generation (RAG) to suggest relevant courses based on the skill gap between a job description and a resume. It leverages:

1. Vector search to find relevant courses
2. Skill extraction to identify the skill gap
3. LLM-based generation to create personalized recommendations

## Using the Feature

### 1. Enter Job Description and Resume

Enter a job description and resume in the provided text areas. You can use your own text or use one of the sample texts provided.

### 2. Adjust Similarity Threshold (Optional)

Use the slider to adjust the similarity threshold. This affects how skills are matched:
- Lower values (0.1-0.4) are more lenient, matching skills with weaker similarities
- Higher values (0.6-0.9) are stricter, requiring stronger matches

### 3. Get Recommendations

Click the "Recommend Courses" button to generate course recommendations based on the skill gap.

### 4. Review Recommendations

The system will display:
- The identified skill gap
- A list of recommended courses with descriptions
- Links to the recommended courses (when available)
- Additional learning resources

### 5. Access Courses

Click "Visit Course" to open the course page in a new tab.

## How It Works

1. **Skill Gap Analysis**: The system extracts skills from both the resume and job description, then identifies the missing skills.
2. **Vector Search**: The skill gap and job description are used to search for relevant courses in a vector database.
3. **LLM Generation**: A large language model generates personalized course recommendations.
4. **Result Processing**: The recommendations are processed to extract course names, descriptions, and URLs.

## Troubleshooting

- **Empty Recommendations**: If no recommendations are displayed, try using a more detailed job description or resume.
- **Slow Response**: Course recommendations may take longer to generate than regular skill comparisons due to the complexity of the RAG system.
- **Missing Course URLs**: Some courses may not have associated URLs if they couldn't be found in the course database.

## Additional Features

In addition to course recommendations, you can also:
- Compare skills using semantic matching
- See a detailed breakdown of matching and missing skills
- Explore online learning platforms through the provided resource links 
