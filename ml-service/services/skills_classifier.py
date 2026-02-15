"""
Skills Classifier — categorises raw skill strings into groups using
TF-IDF + Random Forest (pre-trained) with a rule-based fallback.
"""

import os
import logging
import joblib ####
from config import SKILLS_MODEL_PATH, SKILLS_VECTORIZER_PATH

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Rule-based taxonomy (always available)
# ---------------------------------------------------------------------------

SKILL_TAXONOMY = {
    "Programming Languages": {
        "python", "java", "javascript", "typescript", "c", "c++", "c#",
        "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "scala",
        "r", "matlab", "perl", "dart", "lua", "haskell", "elixir",
    },
    "Web Frameworks": {
        "react", "reactjs", "react.js", "angular", "vue", "vuejs", "vue.js",
        "next.js", "nextjs", "nuxt", "svelte", "django", "flask", "fastapi",
        "spring", "spring boot", "springboot", "express", "expressjs",
        "node", "nodejs", "node.js", "rails", "ruby on rails", "laravel",
        "asp.net", ".net", "nestjs",
    },
    "Databases": {
        "mysql", "postgresql", "postgres", "mongodb", "redis", "sqlite",
        "oracle", "sql server", "mssql", "cassandra", "dynamodb",
        "firebase", "firestore", "neo4j", "mariadb", "couchdb",
        "elasticsearch", "sql", "nosql",
    },
    "Cloud & DevOps": {
        "aws", "azure", "gcp", "google cloud", "docker", "kubernetes",
        "k8s", "jenkins", "github actions", "ci/cd", "terraform",
        "ansible", "nginx", "apache", "heroku", "vercel", "netlify",
        "digitalocean", "linux", "bash", "shell",
    },
    "AI / ML": {
        "machine learning", "deep learning", "tensorflow", "pytorch",
        "keras", "scikit-learn", "sklearn", "opencv", "nlp",
        "natural language processing", "computer vision", "pandas",
        "numpy", "matplotlib", "seaborn", "huggingface", "transformers",
        "langchain", "llm", "generative ai", "data science",
    },
    "Mobile": {
        "android", "ios", "flutter", "react native", "swiftui",
        "jetpack compose", "xamarin", "ionic", "cordova",
    },
    "Tools & Platforms": {
        "git", "github", "gitlab", "bitbucket", "jira", "confluence",
        "figma", "postman", "vscode", "intellij", "eclipse",
        "jupyter", "colab", "notion",
    },
    "Soft Skills": {
        "leadership", "teamwork", "communication", "problem solving",
        "problem-solving", "critical thinking", "time management",
        "adaptability", "collaboration", "mentoring", "presentation",
        "public speaking", "agile", "scrum",
    },
}

# Build reverse lookup
_SKILL_TO_CATEGORY: dict[str, str] = {}
for cat, skills in SKILL_TAXONOMY.items():
    for s in skills:
        _SKILL_TO_CATEGORY[s.lower()] = cat


# ---------------------------------------------------------------------------
# ML model (optional — trained model can be loaded if available)
# ---------------------------------------------------------------------------

_ml_model = None
_ml_vectorizer = None


def _load_ml_model():
    global _ml_model, _ml_vectorizer
    if os.path.exists(SKILLS_MODEL_PATH) and os.path.exists(SKILLS_VECTORIZER_PATH):
        try:
            _ml_model = joblib.load(SKILLS_MODEL_PATH)
            _ml_vectorizer = joblib.load(SKILLS_VECTORIZER_PATH)
            logger.info("Skills classifier ML model loaded")
        except Exception as e:
            logger.warning(f"Could not load skills ML model: {e}")


_load_ml_model()


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def classify_skills(skills: list[str]) -> dict[str, list[str]]:
    """
    Classify a list of skill strings into categories.
    Returns: {"Programming Languages": ["Python", "Java"], "Web Frameworks": ["React"], ...}
    """
    if not skills:
        return {}

    categorised: dict[str, list[str]] = {}
    uncategorised: list[str] = []

    for skill in skills:
        skill_clean = skill.strip()
        if not skill_clean:
            continue

        key = skill_clean.lower()

        # 1. Try exact rule-based match
        cat = _SKILL_TO_CATEGORY.get(key)
        if cat:
            categorised.setdefault(cat, []).append(skill_clean)
            continue

        # 2. Try substring match
        matched = False
        for taxonomy_skill, taxonomy_cat in _SKILL_TO_CATEGORY.items():
            if taxonomy_skill in key or key in taxonomy_skill:
                categorised.setdefault(taxonomy_cat, []).append(skill_clean)
                matched = True
                break

        if matched:
            continue

        # 3. Try ML model if available
        if _ml_model and _ml_vectorizer:
            try:
                vec = _ml_vectorizer.transform([key])
                pred = _ml_model.predict(vec)[0]
                categorised.setdefault(pred, []).append(skill_clean)
                continue
            except Exception:
                pass

        # 4. Fallback — put in "Other"
        uncategorised.append(skill_clean)

    if uncategorised:
        categorised["Other"] = uncategorised

    return categorised
