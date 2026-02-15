"""
Resume Generator Orchestrator — coordinates all ML services to produce
a complete AI-enhanced resume from structured student data.
"""

import logging
from services.summary_generator import generate_summary, enhance_project, enhance_achievement
from services.skills_classifier import classify_skills
from services.project_ranker import rank_projects
from services.achievement_scorer import score_achievements
from services.ats_scorer import compute_ats_score

logger = logging.getLogger(__name__)


def generate_resume(data: dict) -> dict:
    """
    Main entry point. Takes structured student data and returns
    a fully AI-enhanced resume payload.

    Input data schema:
    {
        "student": { "name", "email", "mobile", "skills": [], "gitlink", "portfolio" },
        "academics": { "course", "branch", "year", "semester", "cgpa", "batch", "section" },
        "projects": [{ "title", "description", "role", "gitlink", "deploylink" }],
        "achievements": [{ "title", "category", "description" }],
        "target_role": "Software Engineer Intern",
        "template": "professional"
    }
    """
    target_role = data.get("target_role", "")
    template = data.get("template", "professional")
    student = data.get("student", {})
    academics = data.get("academics", {})
    projects = list(data.get("projects", []) or [])
    achievements = list(data.get("achievements", []) or [])
    skills_raw = list(student.get("skills", []) or [])

    logger.info(f"Generating resume for {student.get('name', 'unknown')} | role={target_role} | template={template}")

    # -----------------------------------------------------------------------
    # 1. Classify skills (ML/rule-based)
    # -----------------------------------------------------------------------
    categorised_skills = classify_skills(skills_raw)
    logger.info(f"Skills classified: {len(skills_raw)} → {len(categorised_skills)} categories")

    # -----------------------------------------------------------------------
    # 2. Rank projects by relevance (sentence-transformer)
    # -----------------------------------------------------------------------
    ranked_projects = rank_projects(projects, target_role)
    logger.info(f"Projects ranked: {len(ranked_projects)} projects")

    # -----------------------------------------------------------------------
    # 3. Score achievements by impact (NLP heuristics)
    # -----------------------------------------------------------------------
    scored_achievements = score_achievements(achievements)
    logger.info(f"Achievements scored: {len(scored_achievements)} items")

    # -----------------------------------------------------------------------
    # 4. Generate AI summary (LLM with fallback)
    # -----------------------------------------------------------------------
    summary = generate_summary(data)
    logger.info(f"Summary generated: {len(summary)} chars")

    # -----------------------------------------------------------------------
    # 5. Enhance project descriptions (LLM with fallback)
    # -----------------------------------------------------------------------
    for proj in ranked_projects:
        try:
            enhanced = enhance_project(proj, target_role)
            proj["enhanced_description"] = enhanced
        except Exception as e:
            logger.warning(f"Project enhancement failed for '{proj.get('title')}': {e}")
            proj["enhanced_description"] = proj.get("description", "")

    # -----------------------------------------------------------------------
    # 6. Enhance achievement lines (LLM with fallback)
    # -----------------------------------------------------------------------
    for ach in scored_achievements:
        try:
            enhanced = enhance_achievement(ach)
            ach["enhanced_line"] = enhanced
        except Exception as e:
            logger.warning(f"Achievement enhancement failed for '{ach.get('title')}': {e}")
            ach["enhanced_line"] = ach.get("title", "")

    # -----------------------------------------------------------------------
    # 7. Compute ATS score
    # -----------------------------------------------------------------------
    resume_for_ats = {
        "summary": summary,
        "student": student,
        "academics": academics,
        "projects": ranked_projects,
        "achievements": scored_achievements,
    }
    ats_result = compute_ats_score(resume_for_ats, target_role)
    logger.info(f"ATS score: {ats_result['ats_score']}")

    # -----------------------------------------------------------------------
    # 8. Assemble response
    # -----------------------------------------------------------------------
    response = {
        "name": student.get("name", ""),
        "email": student.get("email", ""),
        "mobile": student.get("mobile"),
        "summary": summary,
        "education": _format_education(academics),
        "skills": categorised_skills,
        "projects": [
            {
                "title": p.get("title", ""),
                "description": p.get("description", ""),
                "enhanced_description": p.get("enhanced_description", ""),
                "role": p.get("role", ""),
                "gitlink": p.get("gitlink", ""),
                "deploylink": p.get("deploylink", ""),
                "relevance_score": p.get("relevance_score", 0),
            }
            for p in ranked_projects
        ],
        "achievements": [
            {
                "title": a.get("title", ""),
                "category": a.get("category", ""),
                "description": a.get("description", ""),
                "enhanced_line": a.get("enhanced_line", ""),
                "impact_score": a.get("impact_score", 0),
            }
            for a in scored_achievements
        ],
        "links": _collect_links(student),
        "ats_score": ats_result["ats_score"],
        "matched_keywords": ats_result["matched_keywords"],
        "missing_keywords": ats_result["missing_keywords"],
        "suggestions": ats_result["suggestions"],
        "target_role": target_role,
        "template": template,
    }

    return response


def _format_education(academics: dict) -> str:
    course = academics.get("course", "")
    branch = academics.get("branch", "")
    year = academics.get("year", "")
    cgpa = academics.get("cgpa", "")
    batch = academics.get("batch", "")

    edu = f"{course} in {branch}" if course and branch else course or branch or "N/A"
    if year:
        edu += f", Year {year}"
    if cgpa:
        edu += f" | CGPA: {cgpa}"
    if batch:
        edu += f" (Batch {batch})"
    return edu


def _collect_links(student: dict) -> list[str]:
    links = []
    if student.get("gitlink"):
        links.append(student["gitlink"])
    if student.get("portfolio"):
        links.append(student["portfolio"])
    return links
