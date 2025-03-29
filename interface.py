# interface.py
import sys
import spacy
from pathlib import Path


def load_model(model_name: str):
    model_path = Path("models") / model_name
    if not model_path.exists():
        raise FileNotFoundError(f"Model '{model_name}' not found in ./models/")
    return spacy.load(str(model_path))


model1 = "ner_10000_word2vec_glassdoor"
model2 = "ner_model_1000_word2vec"
model3 = "ner_model_20000"

# Load the models
nlp_10000_glassdoor_text = load_model(model1)
nlp_1000_word2vec = load_model(model2)
nlp_20000 = load_model(model3)

# Example text for testing
example_text = """Geospatial Analyst: Job Description
Bachelor's degree in Geography, GIS, Engineering, or related field
6 Years of experience with lidar sensors and lidar classification and DEM creation
Working knowledge of topo-bathy lidar sensors, including sensor hardware, operation, maintenance, flight planning, and processing
Thorough understanding of geospatial projections and ellipsoid/geoid elevation data
Must be able to obtain and maintain a DoD TS/SCI security clearance
Strong written and verbal communication skills

Responsibilities
Support development of new data acquisition and processing procedures
Investigate and identify new and emerging technologies
Support process improvement, automation, and machine learning initiatives and practices to advance data processing and analytics
Work on complex projects with no supervision
Support digital modernization initiatives

About Solis Applied Science
Solis Applied Science (Solis), a Service-Disabled Veteran-Owned Small Business, was founded in 2016 by remote sensing experts, with deep-rooted academic, federal, military, and industry applied science backgrounds. From the onset, the focus of Solis has been to develop critical customer capabilities and apply novel technologies to problems across the remote sensing continuum. The result is a distinct appreciation of how remote sensing technologies can influence real-world situations and a genuine desire to assist our customers in adapting to an ever-changing, technology-driven environment. Our innovative, common-sense solutions solve the most complex problems our customers face and maximize return on their technology investments."""
