"""
Service for similarity comparison using sentence transformers.
"""

from typing import Dict, List, Optional, Set

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class SimilarityService:
    """Service for similarity comparison using sentence transformers."""

    _model = None

    @classmethod
    def get_model(cls) -> SentenceTransformer:
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
    def get_embeddings(cls, texts: List[str]) -> np.ndarray:
        """
        Get embeddings for a list of texts.

        Args:
            texts: List of strings to encode

        Returns:
            Array of embeddings
        """
        model = cls.get_model()
        embeddings = model.encode(texts)
        return embeddings

    @classmethod
    def get_avg_vector(
        cls, skill: str, embedding_model: Dict[str, np.ndarray]
    ) -> Optional[np.ndarray]:
        """
        Get the average vector for a multi-word skill from word embeddings.

        Args:
            skill: Skill text
            embedding_model: Dictionary mapping words to their vectors

        Returns:
            Average vector or None if no words found in the embedding model
        """
        words = skill.lower().split()
        vectors = [embedding_model[word] for word in words if word in embedding_model]
        return np.mean(vectors, axis=0) if vectors else None

    @classmethod
    def compute_similarity(cls, text1: str, text2: str) -> float:
        """
        Compute the cosine similarity between two texts.

        Args:
            text1: First text
            text2: Second text

        Returns:
            Similarity score between 0 and 1
        """
        embeddings = cls.get_embeddings([text1, text2])
        return cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]

    @classmethod
    def semantic_matching_score(
        cls,
        job_skills: Set[str],
        user_skills: Set[str],
        threshold: float = 0.5,
        verbose: bool = False,
    ) -> Dict:
        """
        Computes semantic match score between user and job skills using sentence transformers.

        Args:
            job_skills: Set of skills required for the job.
            user_skills: Set of skills the user currently has.
            threshold: Cosine similarity threshold to consider a match.
            verbose: Whether to print skill matches and gaps.

        Returns:
            Dictionary containing score and detailed matching information
        """
        # Convert sets to lists for encoding
        job_skills_list = list(job_skills)
        user_skills_list = list(user_skills)

        # Get all skills for embedding
        all_skills = job_skills_list + user_skills_list

        # Skip if no skills to compare
        if not job_skills or not user_skills:
            return {
                "score": 0.0,
                "matched_skills": [],
                "missing_skills": list(job_skills) if job_skills else [],
                "matching_details": [],
            }

        # Get embeddings for all skills at once (more efficient)
        embeddings = cls.get_embeddings(all_skills)

        # Split embeddings back into job and user skills
        job_embeddings = embeddings[: len(job_skills_list)]
        user_embeddings = embeddings[len(job_skills_list) :]

        matched_skills = []
        missing_skills = []
        matching_details = []

        # Compare each job skill with all user skills
        for i, job_skill in enumerate(job_skills_list):
            max_similarity = 0
            best_match = None

            # Calculate similarity with each user skill
            for j, user_skill in enumerate(user_skills_list):
                sim = cosine_similarity([job_embeddings[i]], [user_embeddings[j]])[0][0]

                if sim > max_similarity:
                    max_similarity = sim
                    best_match = user_skill

            # Record match details
            detail = {
                "job_skill": job_skill,
                "best_match": best_match,
                "similarity": float(max_similarity),
                "is_match": max_similarity >= threshold,
            }
            matching_details.append(detail)

            # Add to matched or missing based on threshold
            if max_similarity >= threshold:
                matched_skills.append(job_skill)
            else:
                missing_skills.append(job_skill)

        # Calculate the score as a percentage
        match_ratio = len(matched_skills) / len(job_skills_list)
        score = round(match_ratio * 100, 2)

        if verbose:
            print(
                f"✅ Matched: {len(matched_skills)} / {len(job_skills_list)} | Score: {score}"
            )

        return {
            "score": score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "matching_details": matching_details,
        }
