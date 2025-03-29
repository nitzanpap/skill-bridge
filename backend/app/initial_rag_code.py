import warnings

import cohere
import pyspark.sql.functions as F
from pinecone import Pinecone
from pyspark.sql import DataFrame
from pyspark.sql.functions import col, concat_ws
from pyspark.sql.types import ArrayType, FloatType
from sentence_transformers import SentenceTransformer

warnings.filterwarnings("ignore")


def upload_data(file_location):
    # File location and type
    file_type = "csv"

    # CSV options
    infer_schema = "false"
    first_row_is_header = "true"
    delimiter = ","
    quote_char = '"'

    # The applied options are for CSV files. For other file types, these will be ignored.
    df = (
        spark.read.format(file_type)
        .option("inferSchema", infer_schema)
        .option("header", first_row_is_header)
        .option("sep", delimiter)
        .option("multiline", "true")
        .option("quote", quote_char)
        .option("maxCharsPerColumn", 1000000)
        .option("escape", '"')
        .load(file_location)
    )

    return df


courses_df = upload_data(file_location=dataset_path)

# Step 1: Concatenate
courses_concat_text = courses_df.withColumn(
    "course_desc",
    concat_ws(
        "; ",
        col("Title"),
        col("Category"),
        col("Sub-Category"),
        col("Short Intro"),
        col("Skills"),
    ),
)

courses_concat_text = courses_concat_text.select(
    "Title", "url", "course_desc", "Skills"
)

courses_concat_text = courses_concat_text.dropDuplicates(["url"])


def load_and_embedd_dataset(
    dataset: DataFrame,
    model: SentenceTransformer = SentenceTransformer("all-MiniLM-L6-v2"),
    text_field: str = "course_desc",
) -> tuple:
    """
    Load a dataset and embedd the text field using a sentence-transformer model
    Args:
        dataset_name: The name of the dataset to load
        split: The split of the dataset to load
        model: The model to use for embedding
        text_field: The field in the dataset that contains the text
        rec_num: The number of records to load and embedd
    Returns:
        tuple: A tuple containing the dataset and the embeddings
    """

    print("Loading and embedding the dataset")

    def embed_text(text):
        return model.encode(text).tolist() if text else None

    embed_udf = udf(embed_text, ArrayType(FloatType()))

    # Embed the first rec_num rows of the dataset
    result_df = dataset.withColumn("embedding", embed_udf(dataset[text_field]))

    print("Done!")
    return result_df


dataset = load_and_embedd_dataset(
    dataset=courses_concat_text, model=model, text_field="course_desc"
)

INDEX_NAME = "course-index-prod"
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)


def augment_prompt(
    job_description: str,
    user_data: str,
    model: SentenceTransformer = SentenceTransformer("all-MiniLM-L6-v2"),
    index=None,
    ground_truth_skills=None,
) -> str:
    results = [float(val) for val in list(model.encode(job_description))]

    # get top 50 results from knowledge base
    query_results = index.query(
        vector=results, top_k=50, include_values=True, include_metadata=True
    )["matches"]
    text_matches = [match["metadata"]["course_desc"] for match in query_results]

    # get the text from the results
    courses = "\n\n".join(text_matches)

    if ground_truth_skills is not None:
        job_skills = set(ground_truth_skills)
    else:
        job_skills = extract_distinct_entities_from_all_models(job_description)
    user_skills = extract_distinct_entities_from_all_models(user_data)
    skill_gap = job_skills.difference(user_skills)

    # feed into an augmented prompt
    improved_prompt = f"""Based on the list of courses provided below, recommend the 5 most relevant courses that best address the skill gaps between the candidate’s current abilities and the skills required for the job listing. Prioritize courses that are both highly relevant to the missing skills and well-aligned with the job requirements.
    Courses:
    {courses}
    Skill gap:
    {skill_gap}
    Job listing: {job_description}"""

    return improved_prompt, text_matches, job_skills, user_skills


def generate_augmented_answer(query, user, ground_truth_skills=None):
    augmented_prompt, source_knowledge, job_skills, user_skills = augment_prompt(
        query, user, model=model, index=index, ground_truth_skills=ground_truth_skills
    )
    co = cohere.Client(api_key=COHERE_API_KEY)
    response = co.chat(
        model="command-r-plus",
        message=augmented_prompt,
    )
    return response.text, source_knowledge, job_skills, user_skills


import re


def get_relevant_courses_data_from_answer(answer):
    courses_names = re.findall(r"\d+\.\s+(.*?):", answer)
    courses_data = []
    for course in courses_names:
        # Try to find the course in dataset (contains is more lenient than exact match)
        result = dataset.filter(F.col("Title").contains(course)).select("url").collect()
        if result:
            # return the course name and url
            courses_data.append({"course_name": course, "url": result[0]["url"]})
    return courses_data
