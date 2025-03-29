# interface.py
import sys
import spacy
from pathlib import Path

model1 = "ner_10000_word2vec_glassdoor"
model2 = "ner_model_1000_word2vec"
model3 = "ner_model_20000"


def load_model(model_name: str):
    model_path = Path("models") / model_name
    if not model_path.exists():
        raise FileNotFoundError(f"Model '{model_name}' not found in ./models/")
    return spacy.load(str(model_path))


def analyze_text(text: str, model_name: str):
    print(f"\n🔍 Using model: {model_name}\n")
    nlp = load_model(model_name)
    doc = nlp(text)
    for ent in doc.ents:
        print(f"{ent.text} ({ent.label_})")
    print("\n✅ Done.\n")


if __name__ == "__main__":
    # if len(sys.argv) < 3:
    #     print("Usage: python interface.py '<text>' <model_folder_name>")
    #     sys.exit(1)

    # text_input = sys.argv[1]
    # model_folder = sys.argv[2]

    # Example usage
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
    text_input = example_text
    model_folder = model1  # Change to model2 or model3 as needed
    analyze_text(text_input, model_folder)
