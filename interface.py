# inference.py
import spacy

# Load the model from the folder
nlp = spacy.load("models/en_model_v1")

# Example usage
text = "Elon Musk founded SpaceX."
doc = nlp(text)

print("Entities:")
for ent in doc.ents:
    print(f"{ent.text} ({ent.label_})")
