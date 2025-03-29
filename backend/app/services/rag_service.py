"""
Service for Retrieval-Augmented Generation (RAG) based course recommendations.
"""

import re
from typing import Any, Dict, List, Optional, Set, Tuple

import cohere
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

from ..core.config import COHERE_API_KEY, PINECONE_API_KEY, PINECONE_INDEX_NAME
from .nlp_service import NLPService


class RAGService:
    """Service for Retrieval-Augmented Generation (RAG) based course recommendations."""

    _model = None
    _pc = None
    _index = None
    _dataset = None

    @classmethod
    def _get_model(cls) -> SentenceTransformer:
        """
        Get or initialize the sentence transformer model.

        Returns:
            The sentence transformer model instance
        """
        if cls._model is None:
            # Using a pre-trained model that works well for semantic similarity
            cls._model = SentenceTransformer("all-MiniLM-L6-v2")
        return cls._model

    @classmethod
    def _get_pinecone_index(cls):
        """
        Get or initialize the Pinecone index.

        Returns:
            The Pinecone index instance
        """
        if cls._pc is None or cls._index is None:
            cls._pc = Pinecone(api_key=PINECONE_API_KEY)
            cls._index = cls._pc.Index(PINECONE_INDEX_NAME)
        return cls._index

    @classmethod
    def augment_prompt(
        cls,
        job_description: str,
        user_data: str,
        ground_truth_skills: Optional[Set[str]] = None,
    ) -> Tuple[str, List[str], Set[str], Set[str]]:
        """
        Generate an augmented prompt for the LLM using vector search results.

        Args:
            job_description: Text of the job description
            user_data: Text of the user resume/profile
            ground_truth_skills: Optional set of predefined skills for the job

        Returns:
            Tuple containing:
            - Augmented prompt for LLM
            - List of relevant course descriptions from vector search
            - Set of job skills identified
            - Set of user skills identified
        """
        # Get the model and convert job description to vector
        model = cls._get_model()
        results = model.encode(job_description).tolist()

        # Get Pinecone index
        index = cls._get_pinecone_index()

        # Get top 50 results from knowledge base
        query_results = index.query(
            vector=results, top_k=50, include_values=True, include_metadata=True
        )["matches"]
        text_matches = [match["metadata"]["course_desc"] for match in query_results]

        # Get the text from the results
        courses = "\n\n".join(text_matches)

        # Extract skills using NLP service
        if ground_truth_skills is not None:
            job_skills = set(ground_truth_skills)
        else:
            job_entities = NLPService.extract_distinct_entities_from_all_models(
                job_description
            )
            job_skills = {
                e.text
                for e in job_entities
                if e.label.upper() in ("SKILL", "PRODUCT", "ORG", "GPE", "LANGUAGE")
            }

        user_entities = NLPService.extract_distinct_entities_from_all_models(user_data)
        user_skills = {
            e.text
            for e in user_entities
            if e.label.upper() in ("SKILL", "PRODUCT", "ORG", "GPE", "LANGUAGE")
        }

        # Calculate skill gap
        skill_gap = job_skills.difference(user_skills)

        # Create an augmented prompt
        improved_prompt = f"""Based on the list of courses provided below, recommend the 5 most relevant courses that best address the skill gaps between the candidate's current abilities and the skills required for the job listing. Prioritize courses that are both highly relevant to the missing skills and well-aligned with the job requirements.
        
        Courses:
        {courses}
        
        Skill gap:
        {skill_gap}
        
        Job listing: {job_description}
        
        Format your response as a numbered list (1-5) with each course presented as:
        1. [Course Title]: Brief explanation of why this course addresses the skill gap
        """

        return improved_prompt, text_matches, job_skills, user_skills

    @classmethod
    def generate_course_recommendations(
        cls,
        job_description: str,
        user_data: str,
        ground_truth_skills: Optional[Set[str]] = None,
    ) -> Dict[str, Any]:
        """
        Generate course recommendations based on skill gap between job requirements and user resume.

        Args:
            job_description: Text of the job description
            user_data: Text of the user resume/profile
            ground_truth_skills: Optional set of predefined skills for the job

        Returns:
            Dictionary containing course recommendations and related information
        """
        try:
            # Generate augmented prompt using vector search
            augmented_prompt, source_knowledge, job_skills, user_skills = (
                cls.augment_prompt(job_description, user_data, ground_truth_skills)
            )

            # Call Cohere API for LLM-generated recommendations
            co = cohere.Client(api_key=COHERE_API_KEY)
            response = co.chat(
                model="command-r-plus",
                message=augmented_prompt,
            )

            # Extract course recommendations from the response
            recommended_courses = cls.extract_course_recommendations(response.text)

            # Calculate skill gap
            skill_gap = list(job_skills.difference(user_skills))

            return {
                "recommended_courses": recommended_courses,
                "skill_gap": skill_gap,
                "job_skills": list(job_skills),
                "user_skills": list(user_skills),
                "recommendations_text": response.text,
            }

        except Exception as e:
            # Log the error
            print(f"Error generating course recommendations: {str(e)}")
            # Return a graceful failure response
            return {
                "recommended_courses": [],
                "skill_gap": [],
                "job_skills": [],
                "user_skills": [],
                "recommendations_text": f"Error generating recommendations: {str(e)}",
                "error": str(e),
            }

    @classmethod
    def extract_course_recommendations(cls, llm_response: str) -> List[Dict[str, str]]:
        """
        Extract course information from LLM response.

        Args:
            llm_response: The text response from the LLM

        Returns:
            List of dictionaries containing course name and URL
        """
        # Extract course names using regex
        course_pattern = r"\d+\.\s+([^:]+):"
        courses_names = re.findall(course_pattern, llm_response)

        # Get the Pinecone index for searching
        index = cls._get_pinecone_index()

        courses_data = []
        for course_name in courses_names:
            course_name = course_name.strip()
            # Create a search vector for the course name
            model = cls._get_model()
            query_vector = model.encode(course_name).tolist()

            # Search for the course in Pinecone without filtering
            results = index.query(
                vector=query_vector,
                top_k=10,
                include_metadata=True,
            )["matches"]

            # Filter results programmatically
            found_match = False
            for result in results:
                title = result["metadata"].get("Title", "")
                # Check if the course_name is part of the title (case-insensitive)
                if course_name.lower() in title.lower():
                    courses_data.append(
                        {
                            "course_name": course_name,
                            "url": result["metadata"].get("url", ""),
                            "description": result["metadata"].get("course_desc", ""),
                        }
                    )
                    found_match = True
                    break

            # If no match found, use the best semantic match
            if not found_match and results:
                best_match = results[0]
                courses_data.append(
                    {
                        "course_name": course_name,
                        "url": best_match["metadata"].get("url", ""),
                        "description": best_match["metadata"].get("course_desc", ""),
                    }
                )
            elif not found_match:
                # Fallback: add without URL if nothing found
                courses_data.append(
                    {"course_name": course_name, "url": "", "description": ""}
                )

        return courses_data
