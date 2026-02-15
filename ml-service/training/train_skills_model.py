"""
Train a TF-IDF + Random Forest skills classifier.
Run: python training/train_skills_model.py

This produces:
  models/skills_classifier.pkl
  models/skills_vectorizer.pkl
"""

import os
import sys
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# -----------------------------------------------------------------------
# Training data — skill text → category label
# -----------------------------------------------------------------------

TRAINING_DATA = [
    # Programming Languages
    ("python", "Programming Languages"), ("python3", "Programming Languages"),
    ("java", "Programming Languages"), ("javascript", "Programming Languages"),
    ("typescript", "Programming Languages"), ("c++", "Programming Languages"),
    ("c programming", "Programming Languages"), ("c#", "Programming Languages"),
    ("golang", "Programming Languages"), ("go lang", "Programming Languages"),
    ("rust", "Programming Languages"), ("ruby", "Programming Languages"),
    ("php", "Programming Languages"), ("swift", "Programming Languages"),
    ("kotlin", "Programming Languages"), ("scala", "Programming Languages"),
    ("r programming", "Programming Languages"), ("matlab", "Programming Languages"),
    ("perl", "Programming Languages"), ("dart", "Programming Languages"),
    ("haskell", "Programming Languages"), ("elixir", "Programming Languages"),
    ("lua", "Programming Languages"), ("assembly", "Programming Languages"),
    ("fortran", "Programming Languages"), ("cobol", "Programming Languages"),
    ("visual basic", "Programming Languages"), ("groovy", "Programming Languages"),
    ("objective-c", "Programming Languages"), ("shell scripting", "Programming Languages"),

    # Web Frameworks
    ("react", "Web Frameworks"), ("reactjs", "Web Frameworks"),
    ("angular", "Web Frameworks"), ("vue.js", "Web Frameworks"),
    ("next.js", "Web Frameworks"), ("nuxt.js", "Web Frameworks"),
    ("svelte", "Web Frameworks"), ("django", "Web Frameworks"),
    ("flask", "Web Frameworks"), ("fastapi", "Web Frameworks"),
    ("spring boot", "Web Frameworks"), ("spring framework", "Web Frameworks"),
    ("express.js", "Web Frameworks"), ("expressjs", "Web Frameworks"),
    ("node.js", "Web Frameworks"), ("nodejs", "Web Frameworks"),
    ("ruby on rails", "Web Frameworks"), ("laravel", "Web Frameworks"),
    ("asp.net", "Web Frameworks"), (".net core", "Web Frameworks"),
    ("nest.js", "Web Frameworks"), ("koa.js", "Web Frameworks"),
    ("gatsby", "Web Frameworks"), ("remix", "Web Frameworks"),
    ("ember.js", "Web Frameworks"), ("backbone.js", "Web Frameworks"),
    ("html css", "Web Frameworks"), ("tailwind css", "Web Frameworks"),
    ("bootstrap", "Web Frameworks"), ("material ui", "Web Frameworks"),
    ("jquery", "Web Frameworks"), ("ajax", "Web Frameworks"),

    # Databases
    ("mysql", "Databases"), ("postgresql", "Databases"),
    ("mongodb", "Databases"), ("redis", "Databases"),
    ("sqlite", "Databases"), ("oracle database", "Databases"),
    ("sql server", "Databases"), ("mssql", "Databases"),
    ("cassandra", "Databases"), ("dynamodb", "Databases"),
    ("firebase", "Databases"), ("firestore", "Databases"),
    ("neo4j", "Databases"), ("mariadb", "Databases"),
    ("couchdb", "Databases"), ("elasticsearch", "Databases"),
    ("sql", "Databases"), ("nosql", "Databases"),
    ("database management", "Databases"), ("rdbms", "Databases"),
    ("plsql", "Databases"), ("hbase", "Databases"),
    ("influxdb", "Databases"), ("supabase", "Databases"),

    # Cloud & DevOps
    ("aws", "Cloud & DevOps"), ("amazon web services", "Cloud & DevOps"),
    ("azure", "Cloud & DevOps"), ("microsoft azure", "Cloud & DevOps"),
    ("gcp", "Cloud & DevOps"), ("google cloud", "Cloud & DevOps"),
    ("docker", "Cloud & DevOps"), ("kubernetes", "Cloud & DevOps"),
    ("jenkins", "Cloud & DevOps"), ("github actions", "Cloud & DevOps"),
    ("ci cd", "Cloud & DevOps"), ("cicd", "Cloud & DevOps"),
    ("terraform", "Cloud & DevOps"), ("ansible", "Cloud & DevOps"),
    ("nginx", "Cloud & DevOps"), ("apache server", "Cloud & DevOps"),
    ("heroku", "Cloud & DevOps"), ("vercel", "Cloud & DevOps"),
    ("netlify", "Cloud & DevOps"), ("digitalocean", "Cloud & DevOps"),
    ("linux administration", "Cloud & DevOps"), ("bash scripting", "Cloud & DevOps"),
    ("devops", "Cloud & DevOps"), ("cloud computing", "Cloud & DevOps"),
    ("serverless", "Cloud & DevOps"), ("lambda", "Cloud & DevOps"),
    ("prometheus", "Cloud & DevOps"), ("grafana", "Cloud & DevOps"),

    # AI / ML
    ("machine learning", "AI / ML"), ("deep learning", "AI / ML"),
    ("tensorflow", "AI / ML"), ("pytorch", "AI / ML"),
    ("keras", "AI / ML"), ("scikit learn", "AI / ML"),
    ("opencv", "AI / ML"), ("computer vision", "AI / ML"),
    ("nlp", "AI / ML"), ("natural language processing", "AI / ML"),
    ("pandas", "AI / ML"), ("numpy", "AI / ML"),
    ("matplotlib", "AI / ML"), ("seaborn", "AI / ML"),
    ("huggingface", "AI / ML"), ("transformers", "AI / ML"),
    ("langchain", "AI / ML"), ("llm", "AI / ML"),
    ("generative ai", "AI / ML"), ("data science", "AI / ML"),
    ("artificial intelligence", "AI / ML"), ("neural network", "AI / ML"),
    ("reinforcement learning", "AI / ML"), ("data mining", "AI / ML"),
    ("data analysis", "AI / ML"), ("statistics", "AI / ML"),
    ("regression", "AI / ML"), ("classification", "AI / ML"),
    ("clustering", "AI / ML"), ("random forest", "AI / ML"),
    ("convolutional neural network", "AI / ML"), ("recurrent neural network", "AI / ML"),
    ("gpt", "AI / ML"), ("bert", "AI / ML"),

    # Mobile
    ("android development", "Mobile"), ("ios development", "Mobile"),
    ("flutter", "Mobile"), ("react native", "Mobile"),
    ("swiftui", "Mobile"), ("jetpack compose", "Mobile"),
    ("xamarin", "Mobile"), ("ionic framework", "Mobile"),
    ("cordova", "Mobile"), ("mobile app development", "Mobile"),
    ("kotlin android", "Mobile"), ("swift ios", "Mobile"),

    # Tools & Platforms
    ("git", "Tools & Platforms"), ("github", "Tools & Platforms"),
    ("gitlab", "Tools & Platforms"), ("bitbucket", "Tools & Platforms"),
    ("jira", "Tools & Platforms"), ("confluence", "Tools & Platforms"),
    ("figma", "Tools & Platforms"), ("postman", "Tools & Platforms"),
    ("vscode", "Tools & Platforms"), ("intellij idea", "Tools & Platforms"),
    ("eclipse", "Tools & Platforms"), ("jupyter notebook", "Tools & Platforms"),
    ("google colab", "Tools & Platforms"), ("notion", "Tools & Platforms"),
    ("trello", "Tools & Platforms"), ("slack", "Tools & Platforms"),
    ("vs code", "Tools & Platforms"), ("pycharm", "Tools & Platforms"),
    ("android studio", "Tools & Platforms"), ("xcode", "Tools & Platforms"),

    # Soft Skills
    ("leadership", "Soft Skills"), ("teamwork", "Soft Skills"),
    ("communication skills", "Soft Skills"), ("problem solving", "Soft Skills"),
    ("critical thinking", "Soft Skills"), ("time management", "Soft Skills"),
    ("adaptability", "Soft Skills"), ("collaboration", "Soft Skills"),
    ("mentoring", "Soft Skills"), ("presentation skills", "Soft Skills"),
    ("public speaking", "Soft Skills"), ("agile methodology", "Soft Skills"),
    ("scrum", "Soft Skills"), ("project management", "Soft Skills"),
    ("analytical thinking", "Soft Skills"), ("creative thinking", "Soft Skills"),
    ("decision making", "Soft Skills"), ("conflict resolution", "Soft Skills"),
    ("negotiation", "Soft Skills"), ("emotional intelligence", "Soft Skills"),
]


def train():
    texts = [t[0] for t in TRAINING_DATA]
    labels = [t[1] for t in TRAINING_DATA]

    print(f"Training on {len(texts)} samples across {len(set(labels))} categories")

    # TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        analyzer="char_wb",
        ngram_range=(2, 5),
        max_features=5000,
    )
    X = vectorizer.fit_transform(texts)

    # Random Forest
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        random_state=42,
        class_weight="balanced",
    )

    # Cross-validation
    scores = cross_val_score(clf, X, labels, cv=5, scoring="accuracy")
    print(f"Cross-val accuracy: {scores.mean():.3f} ± {scores.std():.3f}")

    # Train final model
    clf.fit(X, labels)

    # Save
    os.makedirs("models", exist_ok=True)
    joblib.dump(clf, "models/skills_classifier.pkl")
    joblib.dump(vectorizer, "models/skills_vectorizer.pkl")
    print("Models saved to models/")

    # Quick test
    test_skills = ["react.js", "tensorflow", "docker", "public speaking", "mysql", "dart"]
    for skill in test_skills:
        vec = vectorizer.transform([skill])
        pred = clf.predict(vec)[0]
        print(f"  '{skill}' → {pred}")


if __name__ == "__main__":
    # Run from ml-service directory
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    train()
