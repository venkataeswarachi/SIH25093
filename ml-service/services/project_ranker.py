"""
Project Ranker — ranks projects by relevance to a target role using
sentence-transformer embeddings + cosine similarity.
"""

import logging
import numpy as np
from config import SENTENCE_MODEL

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Lazy-load sentence transformer (heavy model ~80MB, load once)
# ---------------------------------------------------------------------------

_st_model = None


def _get_model():
    global _st_model
    if _st_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _st_model = SentenceTransformer(SENTENCE_MODEL)
            logger.info(f"SentenceTransformer '{SENTENCE_MODEL}' loaded")
        except Exception as e:
            logger.warning(f"SentenceTransformer load failed: {e}")
    return _st_model


def _cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    dot = np.dot(a, b)
    norm = np.linalg.norm(a) * np.linalg.norm(b)
    if norm == 0:
        return 0.0
    return float(dot / norm)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def rank_projects(projects: list[dict], target_role: str = "") -> list[dict]:
    """
    Rank projects by relevance to the target role.
    Adds 'relevance_score' (0-1) to each project dict.
    Returns projects sorted by relevance descending.
    """
    if not projects:
        return []

    # If no target role or model unavailable, assign equal scores
    model = _get_model()
    if not target_role or not model:
        for i, p in enumerate(projects):
            p["relevance_score"] = round(1.0 - (i * 0.05), 2)  # slight decay by order
        return projects

    try:
        # Build text representations
        project_texts = []
        for p in projects:
            text = f"{p.get('title', '')} {p.get('description', '')} {p.get('role', '')}"
            project_texts.append(text.strip())

        # Encode
        all_texts = [target_role] + project_texts
        embeddings = model.encode(all_texts, convert_to_numpy=True)
        role_emb = embeddings[0]
        proj_embs = embeddings[1:]

        # Score
        for i, p in enumerate(projects):
            sim = _cosine_sim(role_emb, proj_embs[i])
            p["relevance_score"] = round(max(0.0, min(1.0, sim)), 2)

        # Sort by score descending
        projects.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)

    except Exception as e:
        logger.warning(f"Project ranking failed: {e}")
        for i, p in enumerate(projects):
            p["relevance_score"] = round(1.0 - (i * 0.05), 2)

    return projects
