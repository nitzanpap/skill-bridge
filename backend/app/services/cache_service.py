"""
Disk-based caching service for the Skill Bridge application.

This service provides caching functionality to store course recommendation results
on disk to avoid recomputing expensive operations for identical inputs.
"""

import hashlib
import json
from pathlib import Path
from typing import Dict, Any, Optional
import diskcache as dc
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CacheService:
    """
    Disk-based caching service for course recommendations.

    Uses diskcache to store results on disk, preserving RAM for ML models
    while providing fast retrieval for repeated requests.
    """

    _cache_instance: Optional[dc.Cache] = None

    @classmethod
    def _get_cache(cls) -> dc.Cache:
        """Get or create the cache instance."""
        if cls._cache_instance is None:
            # Create cache directory relative to the app root
            cache_dir = Path(__file__).parent.parent.parent / "cache"
            cache_dir.mkdir(exist_ok=True)

            # Initialize cache with 500MB size limit
            cls._cache_instance = dc.Cache(
                str(cache_dir),
                size_limit=500_000_000,  # 500MB
                eviction_policy="least-recently-used",
            )
        return cls._cache_instance

    @classmethod
    def _create_cache_key(
        cls, resume_text: str, job_description_text: str, threshold: float
    ) -> str:
        """
        Create a unique cache key from the input parameters.

        Args:
            resume_text: The resume text content
            job_description_text: The job description text content
            threshold: The similarity threshold value

        Returns:
            MD5 hash of the combined inputs as cache key
        """
        # Normalize inputs to ensure consistent caching
        normalized_resume = resume_text.strip().lower()
        normalized_job_desc = job_description_text.strip().lower()

        # Combine all inputs with separators
        combined_input = f"{normalized_resume}|{normalized_job_desc}|{threshold}"

        # Create MD5 hash for the cache key
        cache_key = hashlib.md5(combined_input.encode("utf-8")).hexdigest()
        return cache_key

    @classmethod
    def get_course_recommendation(
        cls, resume_text: str, job_description_text: str, threshold: float
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve cached course recommendation if it exists.

        Args:
            resume_text: The resume text content
            job_description_text: The job description text content
            threshold: The similarity threshold value

        Returns:
            Cached recommendation data or None if not found
        """
        try:
            cache = cls._get_cache()
            cache_key = cls._create_cache_key(
                resume_text, job_description_text, threshold
            )

            result = cache.get(cache_key)

            return result
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Cache retrieval error: {e}")
            return None

    @classmethod
    def set_course_recommendation(
        cls,
        resume_text: str,
        job_description_text: str,
        threshold: float,
        recommendation_data: Dict[str, Any],
        expire_hours: int = 24,
    ) -> bool:
        """
        Cache course recommendation data.

        Args:
            resume_text: The resume text content
            job_description_text: The job description text content
            threshold: The similarity threshold value
            recommendation_data: The recommendation data to cache
            expire_hours: Hours until cache expires (default: 24)

        Returns:
            True if successfully cached, False otherwise
        """
        try:
            cache = cls._get_cache()
            cache_key = cls._create_cache_key(
                resume_text, job_description_text, threshold
            )

            # Cache for specified hours (convert to seconds)
            expire_seconds = expire_hours * 3600
            cache.set(cache_key, recommendation_data, expire=expire_seconds)
            return True
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Cache storage error: {e}")
            return False

    @classmethod
    def clear_cache(cls) -> bool:
        """
        Clear all cached data.

        Returns:
            True if successfully cleared, False otherwise
        """
        try:
            cache = cls._get_cache()
            cache.clear()
            return True
        except Exception as e:
            logger.error(f"Cache clear error: {e}")
            return False

    @classmethod
    def get_cache_stats(cls) -> Dict[str, Any]:
        """
        Get cache statistics.

        Returns:
            Dictionary containing cache statistics
        """
        try:
            cache = cls._get_cache()
            return {
                "cache_size": len(cache),
                "disk_usage_bytes": cache.volume(),
                "cache_hits": getattr(cache, "stats", {}).get("hits", 0),
                "cache_misses": getattr(cache, "stats", {}).get("misses", 0),
            }
        except Exception as e:
            logger.error(f"Cache stats error: {e}")
            return {}
