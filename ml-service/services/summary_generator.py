"""
Summary Generator — uses LLM APIs (Groq → Gemini → fallback templates).
"""

import logging
from config import GROQ_API_KEY, GEMINI_API_KEY, GROQ_MODEL, GEMINI_MODEL
from templates.prompts import (
    SYSTEM_PROMPT,
    build_summary_prompt,
    build_project_enhancement_prompt,
    build_achievement_enhancement_prompt,
    fallback_summary,
    fallback_project_enhance,
    fallback_achievement_enhance,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# LLM client singletons (lazy-loaded)
# ---------------------------------------------------------------------------
_groq_client = None
_gemini_model = None


def _get_groq():
    global _groq_client
    if _groq_client is None and GROQ_API_KEY:
        try:
            from groq import Groq
            _groq_client = Groq(api_key=GROQ_API_KEY)
            logger.info("Groq client initialised")
        except Exception as e:
            logger.warning(f"Groq init failed: {e}")
    return _groq_client


def _get_gemini():
    global _gemini_model
    if _gemini_model is None and GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            _gemini_model = genai.GenerativeModel(GEMINI_MODEL)
            logger.info("Gemini model initialised")
        except Exception as e:
            logger.warning(f"Gemini init failed: {e}")
    return _gemini_model


# ---------------------------------------------------------------------------
# Core LLM call with provider fallback chain
# ---------------------------------------------------------------------------

def _call_llm(system: str, user_prompt: str) -> str | None:
    """Try Groq → Gemini → return None (caller handles template fallback)."""

    # --- Try Groq ---
    client = _get_groq()
    if client:
        try:
            resp = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                max_tokens=512,
            )
            text = resp.choices[0].message.content.strip()
            if text:
                logger.info("LLM response from Groq")
                return text
        except Exception as e:
            logger.warning(f"Groq call failed: {e}")

    # --- Try Gemini ---
    model = _get_gemini()
    if model:
        try:
            combined = f"{system}\n\n{user_prompt}"
            resp = model.generate_content(combined)
            text = resp.text.strip()
            if text:
                logger.info("LLM response from Gemini")
                return text
        except Exception as e:
            logger.warning(f"Gemini call failed: {e}")

    return None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_summary(data: dict) -> str:
    """Generate a professional summary for the resume."""
    prompt = build_summary_prompt(data)
    result = _call_llm(SYSTEM_PROMPT, prompt)
    if result:
        return result
    logger.info("Using fallback template for summary")
    return fallback_summary(data)


def enhance_project(project: dict, target_role: str = "") -> str:
    """Enhance a single project description."""
    prompt = build_project_enhancement_prompt(project, target_role)
    result = _call_llm(SYSTEM_PROMPT, prompt)
    if result:
        return result
    return fallback_project_enhance(project)


def enhance_achievement(achievement: dict) -> str:
    """Polish a single achievement line."""
    prompt = build_achievement_enhancement_prompt(achievement)
    result = _call_llm(SYSTEM_PROMPT, prompt)
    if result:
        return result
    return fallback_achievement_enhance(achievement)


def get_active_provider() -> str:
    """Return which LLM provider is currently active."""
    if _get_groq():
        return "groq"
    if _get_gemini():
        return "gemini"
    return "fallback_templates"
