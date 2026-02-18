"""
ATS (Applicant Tracking System) Scorer -- computes a compatibility score
between a generated resume and a target job description / role using
TF-IDF cosine similarity + keyword overlap analysis.
FAANG-grade: comprehensive keyword banks, smart matching, actionable feedback.
"""

import logging
import re
import math
from collections import Counter

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Comprehensive ATS keywords by role category
# ---------------------------------------------------------------------------

ROLE_KEYWORDS: dict[str, list[str]] = {
    "software engineer": [
        "algorithms", "data structures", "api", "rest", "microservices",
        "testing", "unit test", "agile", "scrum", "git", "ci/cd",
        "design patterns", "scalable", "performance", "debugging",
        "system design", "architecture", "code review", "clean code",
        "version control", "deployment", "containerization",
        "problem solving", "technical", "communication",
        "developed", "implemented", "engineered", "optimized",
        "full stack", "backend", "frontend", "database",
    ],
    "full stack": [
        "react", "javascript", "typescript", "node", "express",
        "html", "css", "responsive", "api", "rest", "graphql",
        "database", "sql", "nosql", "mongodb", "postgresql", "mysql",
        "authentication", "jwt", "oauth", "spring", "django", "flask",
        "docker", "deployment", "git", "agile", "testing",
        "frontend", "backend", "full stack", "microservices",
        "component", "state management", "performance", "scalable",
        "developed", "engineered", "architected", "implemented",
        "deployed", "integrated", "designed", "optimized",
        "problem solving", "technical", "communication", "team",
        "algorithms", "data structures", "system design",
    ],
    "frontend": [
        "react", "javascript", "typescript", "html", "css", "responsive",
        "ui/ux", "accessibility", "spa", "webpack", "component",
        "state management", "api integration", "figma", "tailwind",
        "next.js", "vue", "angular", "redux", "context api",
        "testing", "jest", "performance", "lighthouse", "seo",
        "developed", "designed", "implemented", "built",
        "responsive design", "cross-browser", "mobile-first",
        "problem solving", "technical", "communication",
    ],
    "backend": [
        "api", "rest", "database", "sql", "nosql", "microservices",
        "authentication", "authorization", "caching", "redis",
        "message queue", "scalability", "server", "spring", "node",
        "django", "flask", "fastapi", "docker", "kubernetes",
        "system design", "architecture", "design patterns",
        "testing", "ci/cd", "deployment", "monitoring",
        "developed", "engineered", "implemented", "optimized",
        "problem solving", "technical", "communication",
        "algorithms", "data structures", "concurrency",
    ],
    "data science": [
        "machine learning", "deep learning", "python", "pandas", "numpy",
        "tensorflow", "pytorch", "statistics", "visualization",
        "data analysis", "sql", "feature engineering", "model",
        "nlp", "computer vision", "scikit-learn", "jupyter",
        "a/b testing", "hypothesis", "regression", "classification",
        "analyzed", "developed", "implemented", "researched",
        "problem solving", "technical", "communication",
    ],
    "devops": [
        "docker", "kubernetes", "ci/cd", "jenkins", "terraform",
        "aws", "azure", "gcp", "monitoring", "linux", "bash",
        "infrastructure", "deployment", "automation", "ansible",
        "prometheus", "grafana", "logging", "security",
        "implemented", "automated", "deployed", "configured",
        "problem solving", "technical", "communication",
    ],
    "mobile": [
        "android", "ios", "flutter", "react native", "kotlin", "swift",
        "mobile", "responsive", "api", "push notification", "app store",
        "ui/ux", "testing", "performance", "offline",
        "developed", "implemented", "designed", "deployed",
        "problem solving", "technical", "communication",
    ],
    "ml engineer": [
        "machine learning", "deep learning", "python", "tensorflow",
        "pytorch", "nlp", "computer vision", "model", "training",
        "deployment", "mlops", "docker", "api", "scikit-learn",
        "feature engineering", "data pipeline", "optimization",
        "developed", "implemented", "engineered", "trained",
        "problem solving", "technical", "communication", "research",
    ],
}

# Default keywords applicable to any tech role
DEFAULT_KEYWORDS = [
    "project", "team", "developed", "implemented", "designed",
    "collaborated", "problem solving", "technical", "communication",
    "engineered", "architected", "optimized", "deployed",
    "algorithms", "data structures", "git", "agile",
    "testing", "scalable", "performance",
]


# ---------------------------------------------------------------------------
# Simple TF-IDF implementation
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
    resume_lower = resume_text.lower()
    resume_tokens = _tokenize(resume_text)
    resume_token_set = set(resume_tokens)

    # Determine target keywords -- match ALL applicable role categories
    target_kws = list(DEFAULT_KEYWORDS)
    role_lower = target_role.lower().strip() if target_role else ""

    matched_roles = set()
    for role_key, kws in ROLE_KEYWORDS.items():
        # Match if role_key appears in target_role or vice versa
        if role_lower and (role_key in role_lower or role_lower in role_key
                          or any(w in role_lower for w in role_key.split())):
            target_kws.extend(kws)
            matched_roles.add(role_key)

    # If no specific role matched, use software engineer as default
    if not matched_roles and role_lower:
        target_kws.extend(ROLE_KEYWORDS.get("software engineer", []))

    # Deduplicate while preserving order
    seen = set()
    unique_kws = []
    for kw in target_kws:
        if kw not in seen:
            seen.add(kw)
            unique_kws.append(kw)
    target_kws = unique_kws

    # Smart keyword matching (handles multi-word keywords)
    matched = []
    missing = []
    for kw in target_kws:
        kw_lower = kw.lower()
        # For multi-word keywords, check if the phrase appears in text
        if " " in kw_lower:
            if kw_lower in resume_lower:
                matched.append(kw)
            else:
                # Also try matching if all words appear (but not as phrase)
                kw_words = kw_lower.split()
                if all(w in resume_token_set for w in kw_words):
                    matched.append(kw)
                else:
                    missing.append(kw)
        else:
            # Single word -- check token set
            if kw_lower in resume_token_set:
                matched.append(kw)
            else:
                missing.append(kw)

    # Keyword score (55% weight)
    kw_score = (len(matched) / len(target_kws) * 100) if target_kws else 50

    # TF similarity score (20% weight)
    resume_tf = _compute_tf(resume_tokens)
    target_tf = _compute_tf(_tokenize(" ".join(target_kws)))
    sim_score = _cosine_similarity(resume_tf, target_tf) * 100

    # Content completeness score (25% weight)
    completeness = _check_completeness(resume_data)

    # Final weighted score
    final = int(kw_score * 0.55 + sim_score * 0.20 + completeness * 0.25)
    final = max(0, min(100, final))

    # Generate suggestions
    suggestions = _generate_suggestions(resume_data, missing, final, matched, target_role)

    return {
        "ats_score": final,
        "matched_keywords": matched[:20],
        "missing_keywords": missing[:10],
        "suggestions": suggestions[:5],
    }


def _build_resume_text(data: dict) -> str:
    """Concatenate all resume sections into searchable text."""
    parts = []

    # Summary (contains generated action verbs)
    parts.append(data.get("summary", ""))

    # Skills (major keyword source)
    student = data.get("student", {})
    skills = student.get("skills", []) or []
    parts.extend(skills)

    # Projects (both original and enhanced descriptions)
    for p in data.get("projects", []):
        parts.append(p.get("title", ""))
        parts.append(p.get("description", ""))
        parts.append(p.get("enhanced_description", ""))
        parts.append(p.get("role", ""))

    # Achievements (both original and enhanced)
    for a in data.get("achievements", []):
        parts.append(a.get("title", ""))
        parts.append(a.get("description", ""))
        parts.append(a.get("enhanced_line", ""))

    # Education
    academics = data.get("academics", {})
    parts.append(academics.get("course", ""))
    parts.append(academics.get("branch", ""))

    return " ".join(str(p) for p in parts if p)


def _check_completeness(data: dict) -> float:
    """Score 0-100 based on how many resume sections are filled and quality."""
    checks = [
        bool(data.get("summary")),
        bool(data.get("student", {}).get("skills")),
        len(data.get("student", {}).get("skills", []) or []) >= 5,
        bool(data.get("projects")),
        len(data.get("projects", []) or []) >= 2,
        bool(data.get("achievements")),
        bool(data.get("academics", {}).get("cgpa")),
        bool(data.get("student", {}).get("name")),
        bool(data.get("student", {}).get("email")),
        bool(data.get("student", {}).get("gitlink")),
        bool(data.get("student", {}).get("portfolio")),
        # Quality checks
        len(data.get("summary", "")) >= 100,
    ]
    return (sum(checks) / len(checks)) * 100


def _generate_suggestions(data: dict, missing_kws: list, score: int,
                          matched_kws: list = None, target_role: str = "") -> list[str]:
    """Generate actionable, specific suggestions to improve the resume."""
    suggestions = []
    skills = data.get("student", {}).get("skills", []) or []
    projects = data.get("projects", []) or []
    achievements = data.get("achievements", []) or []

    # Skill-based suggestions
    if not skills:
        suggestions.append("Add 8-10 technical skills to your profile -- ATS systems heavily rely on skill keyword matching")
    elif len(skills) < 6:
        suggestions.append(f"You have {len(skills)} skills listed -- aim for 8-12 to maximize ATS keyword coverage")

    # Project-based suggestions
    if not projects:
        suggestions.append("Add 2-3 projects with detailed descriptions including specific technologies used and measurable outcomes")
    elif len(projects) < 2:
        suggestions.append("Add at least one more project -- top resumes showcase 3-4 relevant projects")

    for p in projects:
        desc = p.get("description", "") or ""
        if desc and len(desc) < 50:
            suggestions.append(
                f"Expand '{p.get('title', 'project')}' description -- include specific technologies, your role, and quantified impact"
            )
            break

    # Achievement-based suggestions
    if not achievements:
        suggestions.append("Include achievements: hackathon wins, certifications, competitive programming, or research publications")

    # Missing keyword suggestions (top priority)
    if missing_kws:
        top_missing = missing_kws[:4]
        suggestions.append(
            f"Add these high-impact keywords to boost ATS score: {', '.join(top_missing)}"
        )

    # Link suggestions
    student = data.get("student", {})
    if not student.get("gitlink"):
        suggestions.append("Add a GitHub profile link -- recruiters and ATS systems value open-source contributions")
    if not student.get("portfolio"):
        suggestions.append("Consider adding a portfolio website to showcase your projects visually")

    # Score-based overall feedback
    if score >= 80:
        suggestions.insert(0, "Excellent ATS compatibility! Fine-tune by incorporating any remaining missing keywords naturally into your descriptions")
    elif score >= 60:
        suggestions.insert(0, "Good foundation -- focus on adding missing technical keywords and quantifying project outcomes to push past 80")
    elif score >= 40:
        suggestions.insert(0, "Moderate ATS score -- strengthen by adding more skills, expanding project descriptions with action verbs, and including achievements")
    else:
        suggestions.insert(0, "Your resume needs significant improvement -- expand all sections with specific technologies, metrics, and action verbs")

    return suggestions
