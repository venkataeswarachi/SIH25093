"""
ATS (Applicant Tracking System) Scorer — computes a compatibility score
between a generated resume and a target job description / role using
TF-IDF cosine similarity + keyword overlap analysis.
"""

import logging
import re
import math
from collections import Counter

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Common ATS keywords by role category
# ---------------------------------------------------------------------------

ROLE_KEYWORDS: dict[str, list[str]] = {
    "software engineer": [
        "algorithms", "data structures", "api", "rest", "microservices",
        "testing", "unit test", "agile", "scrum", "git", "ci/cd",
        "design patterns", "scalable", "performance", "debugging",
    ],
    "frontend": [
        "react", "javascript", "typescript", "html", "css", "responsive",
        "ui/ux", "accessibility", "spa", "webpack", "component",
        "state management", "api integration", "figma",
    ],
    "backend": [
        "api", "rest", "database", "sql", "nosql", "microservices",
        "authentication", "authorization", "caching", "redis",
        "message queue", "scalability", "server", "spring", "node",
    ],
    "data science": [
        "machine learning", "deep learning", "python", "pandas", "numpy",
        "tensorflow", "pytorch", "statistics", "visualization",
        "data analysis", "sql", "feature engineering", "model",
    ],
    "devops": [
        "docker", "kubernetes", "ci/cd", "jenkins", "terraform",
        "aws", "azure", "gcp", "monitoring", "linux", "bash",
        "infrastructure", "deployment", "automation",
    ],
    "mobile": [
        "android", "ios", "flutter", "react native", "kotlin", "swift",
        "mobile", "responsive", "api", "push notification", "app store",
    ],
    "intern": [
        "learning", "academic", "project", "teamwork", "communication",
        "problem solving", "eager", "adaptable", "coursework",
    ],
}

# Default keywords applicable to any role
DEFAULT_KEYWORDS = [
    "project", "team", "developed", "implemented", "designed",
    "collaborated", "problem solving", "technical", "communication",
]


# ---------------------------------------------------------------------------
# Simple TF-IDF implementation (no sklearn dependency needed for this)
# ---------------------------------------------------------------------------

def _tokenize(text: str) -> list[str]:
    """Simple tokenizer: lowercase, alphanumeric only."""
    return re.findall(r"[a-z0-9+#/.]+", text.lower())


def _compute_tf(tokens: list[str]) -> dict[str, float]:
    counts = Counter(tokens)
    total = len(tokens)
    return {t: c / total for t, c in counts.items()} if total > 0 else {}


def _cosine_similarity(vec_a: dict[str, float], vec_b: dict[str, float]) -> float:
    """Cosine similarity between two sparse vectors (dicts)."""
    common = set(vec_a.keys()) & set(vec_b.keys())
    dot = sum(vec_a[k] * vec_b[k] for k in common)
    norm_a = math.sqrt(sum(v ** 2 for v in vec_a.values()))
    norm_b = math.sqrt(sum(v ** 2 for v in vec_b.values()))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def compute_ats_score(resume_data: dict, target_role: str = "") -> dict:
    """
    Compute an ATS compatibility score (0-100) for the generated resume.

    Returns:
        {
            "ats_score": int (0-100),
            "matched_keywords": [...],
            "missing_keywords": [...],
            "suggestions": [...]
        }
    """
    # Build resume text from all sections
    resume_text = _build_resume_text(resume_data)
    resume_tokens = _tokenize(resume_text)
    resume_token_set = set(resume_tokens)

    # Determine target keywords
    target_kws = list(DEFAULT_KEYWORDS)
    role_lower = target_role.lower().strip() if target_role else ""

    for role_key, kws in ROLE_KEYWORDS.items():
        if role_key in role_lower or role_lower in role_key:
            target_kws.extend(kws)
            break
    else:
        # If no specific role matched, include general software keywords
        if role_lower:
            target_kws.extend(ROLE_KEYWORDS.get("software engineer", []))

    # Deduplicate
    target_kws = list(dict.fromkeys(target_kws))

    # Keyword matching
    matched = []
    missing = []
    for kw in target_kws:
        kw_tokens = _tokenize(kw)
        if any(t in resume_token_set for t in kw_tokens):
            matched.append(kw)
        else:
            missing.append(kw)

    # Keyword score (60% weight)
    kw_score = (len(matched) / len(target_kws) * 100) if target_kws else 50

    # TF similarity score (20% weight)
    resume_tf = _compute_tf(resume_tokens)
    target_tf = _compute_tf(_tokenize(" ".join(target_kws)))
    sim_score = _cosine_similarity(resume_tf, target_tf) * 100

    # Content completeness score (20% weight)
    completeness = _check_completeness(resume_data)

    # Final weighted score
    final = int(kw_score * 0.6 + sim_score * 0.2 + completeness * 0.2)
    final = max(0, min(100, final))

    # Generate suggestions
    suggestions = _generate_suggestions(resume_data, missing, final)

    return {
        "ats_score": final,
        "matched_keywords": matched[:15],
        "missing_keywords": missing[:10],
        "suggestions": suggestions[:5],
    }


def _build_resume_text(data: dict) -> str:
    """Concatenate all resume sections into searchable text."""
    parts = []

    parts.append(data.get("summary", ""))

    student = data.get("student", {})
    parts.extend(student.get("skills", []) or [])

    for p in data.get("projects", []):
        parts.append(p.get("title", ""))
        parts.append(p.get("description", ""))
        parts.append(p.get("enhanced_description", ""))
        parts.append(p.get("role", ""))

    for a in data.get("achievements", []):
        parts.append(a.get("title", ""))
        parts.append(a.get("description", ""))
        parts.append(a.get("enhanced_line", ""))

    academics = data.get("academics", {})
    parts.append(academics.get("course", ""))
    parts.append(academics.get("branch", ""))

    return " ".join(str(p) for p in parts if p)


def _check_completeness(data: dict) -> float:
    """Score 0-100 based on how many resume sections are filled."""
    checks = [
        bool(data.get("summary")),
        bool(data.get("student", {}).get("skills")),
        bool(data.get("projects")),
        bool(data.get("achievements")),
        bool(data.get("academics", {}).get("cgpa")),
        bool(data.get("student", {}).get("name")),
        bool(data.get("student", {}).get("email")),
    ]
    return (sum(checks) / len(checks)) * 100


def _generate_suggestions(data: dict, missing_kws: list, score: int) -> list[str]:
    """Generate actionable suggestions to improve the resume."""
    suggestions = []

    if not data.get("student", {}).get("skills"):
        suggestions.append("Add technical skills to your profile to improve keyword matches")

    if not data.get("projects"):
        suggestions.append("Add at least 2-3 projects to demonstrate practical experience")

    if not data.get("achievements"):
        suggestions.append("Include achievements, certifications, or hackathon participations")

    if missing_kws:
        top_missing = missing_kws[:3]
        suggestions.append(
            f"Consider highlighting experience with: {', '.join(top_missing)}"
        )

    projects = data.get("projects", [])
    for p in projects:
        desc = p.get("description", "")
        if desc and len(desc) < 30:
            suggestions.append(
                f"Expand the description for project '{p.get('title', '')}' with specific technologies and outcomes"
            )
            break

    if score < 50:
        suggestions.append("Your resume needs significant improvement — add more skills, projects, and quantified achievements")
    elif score < 70:
        suggestions.append("Good start! Add more role-specific keywords and quantify your project outcomes")

    return suggestions
