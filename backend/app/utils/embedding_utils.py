"""
Utility functions for embedding and indexing course data.
"""

import os
from typing import Dict, List, Optional

import pandas as pd
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

from ..core.config import COURSES_DATASET_PATH, PINECONE_API_KEY, PINECONE_INDEX_NAME


def load_courses_data(file_path: Optional[str] = None) -> pd.DataFrame:
    """
    Load course data from a CSV file.

    Args:
        file_path: Path to the CSV file, defaults to config value

    Returns:
        DataFrame containing the course data
    """
    if file_path is None:
        file_path = COURSES_DATASET_PATH

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Course data file not found at: {file_path}")

    # Load the CSV file
    df = pd.read_csv(
        file_path,
        encoding="utf-8",
        quotechar='"',
        escapechar="\\",
        on_bad_lines="skip",
    )

    # Preprocess the data
    df = df.fillna("")  # Fill NaN values

    # Create a combined course description field
    df["course_desc"] = (
        df["Title"].astype(str)
        + "; "
        + df["Category"].astype(str)
        + "; "
        + df["Sub-Category"].astype(str)
        + "; "
        + df["Short Intro"].astype(str)
        + "; "
        + df["Skills"].astype(str)
    )

    # Select relevant columns
    df = df[["Title", "url", "course_desc", "Skills"]]

    # Remove duplicates
    df = df.drop_duplicates(subset=["url"])

    return df


def embed_courses(
    courses_df: pd.DataFrame, model_name: str = "all-MiniLM-L6-v2"
) -> List[Dict]:
    """
    Embed course descriptions using a sentence transformer model.

    Args:
        courses_df: DataFrame containing the course data
        model_name: Name of the sentence transformer model to use

    Returns:
        List of dictionaries containing course data and embeddings
    """
    # Load the model
    model = SentenceTransformer(model_name)

    # Prepare data for indexing
    records = []

    # Process each course
    for i, row in tqdm(
        courses_df.iterrows(), total=len(courses_df), desc="Embedding courses"
    ):
        # Generate embedding
        embedding = model.encode(row["course_desc"]).tolist()

        # Create record
        record = {
            "id": f"course_{i}",
            "values": embedding,
            "metadata": {
                "Title": row["Title"],
                "url": row["url"],
                "course_desc": row["course_desc"],
                "Skills": row["Skills"],
            },
        }

        records.append(record)

    return records


def index_courses(records: List[Dict], batch_size: int = 100) -> None:
    """
    Index course records in Pinecone.

    Args:
        records: List of records to index
        batch_size: Number of records to index in each batch
    """
    # Initialize Pinecone client
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Check if index exists, if not create it
    index_list = pc.list_indexes()

    if PINECONE_INDEX_NAME not in index_list:
        # Create the index
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=len(records[0]["values"]),
            metric="cosine",
        )

    # Get the index
    index = pc.Index(PINECONE_INDEX_NAME)

    # Index records in batches
    for i in tqdm(range(0, len(records), batch_size), desc="Indexing batches"):
        batch = records[i : i + batch_size]
        index.upsert(vectors=batch)


def prepare_and_index_courses(file_path: Optional[str] = None) -> None:
    """
    Prepare and index course data from a CSV file.

    Args:
        file_path: Path to the CSV file
    """
    # Load courses
    print("Loading course data...")
    courses_df = load_courses_data(file_path)
    print(f"Loaded {len(courses_df)} courses")

    # Embed courses
    print("Embedding courses...")
    records = embed_courses(courses_df)

    # Index courses
    print("Indexing courses...")
    index_courses(records)

    print("Course indexing completed successfully!")
