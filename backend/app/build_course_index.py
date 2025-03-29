#!/usr/bin/env python
"""
Script to build and index the course database.
"""

import argparse
import os

from app.core.config import COURSES_DATASET_PATH
from app.utils.embedding_utils import prepare_and_index_courses


def main():
    """
    Main function to run the script.
    """
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Build and index the course database.")
    parser.add_argument(
        "--file_path",
        type=str,
        default=COURSES_DATASET_PATH,
        help="Path to the CSV file containing course data",
    )
    args = parser.parse_args()

    # Check if the file exists
    if not os.path.exists(args.file_path):
        print(f"Error: File '{args.file_path}' does not exist.")
        return 1

    # Build and index the course database
    try:
        prepare_and_index_courses(args.file_path)
        return 0
    except Exception as e:
        print(f"Error building and indexing course database: {str(e)}")
        return 1


if __name__ == "__main__":
    exit(main())
