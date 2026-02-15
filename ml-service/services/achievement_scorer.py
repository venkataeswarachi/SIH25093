"""
Achievement Scorer — scores achievements by impact level using
keyword-based heuristics + optional sentence-transformer similarity.
"""

import logging
import re

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Impact keyword weights
# ---------------------------------------------------------------------------

HIGH_IMPACT_KEYWORDS = {
    "1st place": 1.0, "first place": 1.0, "gold medal": 1.0, "winner": 0.95,
    "won": 0.9, "champion": 0.95, "best": 0.9, "topper": 0.9,
    "national": 0.85, "international": 0.95, "published": 0.85,
    "research paper": 0.85, "patent": 0.95, "founded": 0.9,
    "startup": 0.85, "100%": 0.8,
}

MEDIUM_IMPACT_KEYWORDS = {
    "2nd place": 0.75, "second place": 0.75, "3rd place": 0.7,
    "third place": 0.7, "runner": 0.7, "runner-up": 0.7,
    "silver": 0.75, "bronze": 0.7, "hackathon": 0.7,
    "competition": 0.65, "scholarship": 0.8, "award": 0.7,
    "certified": 0.6, "certification": 0.6, "selected": 0.65,
    "top": 0.7, "lead": 0.65, "organized": 0.6,
    "state level": 0.7, "state": 0.65, "university": 0.55,
}

LOW_IMPACT_KEYWORDS = {
    "participated": 0.3, "participation": 0.3, "attended": 0.25,
    "workshop": 0.35, "seminar": 0.3, "volunteer": 0.4,
    "member": 0.3, "completed": 0.35, "course": 0.35,
    "certificate": 0.4, "training": 0.35, "webinar": 0.25,
}

# Category bonuses
CATEGORY_BONUS = {
    "hackathon": 0.15,
    "competition": 0.1,
    "research": 0.15,
    "publication": 0.2,
    "certification": 0.05,
    "sports": 0.05,
    "cultural": 0.0,
    "volunteer": 0.0,
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def score_achievements(achievements: list[dict]) -> list[dict]:
    """
    Score achievements by impact (0.0 - 1.0).
    Adds 'impact_score' to each achievement dict.
    Returns sorted by score descending.
    """
    if not achievements:
        return []

    for ach in achievements:
        score = _compute_score(ach)
        ach["impact_score"] = round(score, 2)

    achievements.sort(key=lambda x: x.get("impact_score", 0), reverse=True)
    return achievements


def _compute_score(ach: dict) -> float:
    """Compute impact score for a single achievement."""
    title = (ach.get("title", "") or "").lower()
    desc = (ach.get("description", "") or "").lower()
    category = (ach.get("category", "") or "").lower()
    combined = f"{title} {desc}"

    score = 0.3  # base score

    # Scan keywords (take the highest match from each tier)
    high = _scan_keywords(combined, HIGH_IMPACT_KEYWORDS)
    med = _scan_keywords(combined, MEDIUM_IMPACT_KEYWORDS)
    low = _scan_keywords(combined, LOW_IMPACT_KEYWORDS)

    # Weight: highest tier dominates
    if high > 0:
        score = max(score, high)
    elif med > 0:
        score = max(score, med)
    elif low > 0:
        score = max(score, low)

    # Category bonus
    for cat_key, bonus in CATEGORY_BONUS.items():
        if cat_key in category:
            score += bonus
            break

    # Description length bonus (longer = more detail = likely more significant)
    if len(desc) > 100:
        score += 0.05
    if len(desc) > 200:
        score += 0.05

    return min(1.0, score)


def _scan_keywords(text: str, keyword_map: dict) -> float:
    """Return the highest score from matching keywords."""
    best = 0.0
    for keyword, weight in keyword_map.items():
        if keyword in text:
            best = max(best, weight)
    return best
