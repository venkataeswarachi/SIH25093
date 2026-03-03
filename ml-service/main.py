"""
ML Resume Builder Microservice — FastAPI application.

Receives structured student data from Spring Boot backend,
runs ML pipeline (skills classification, project ranking,
achievement scoring, LLM summary generation, ATS scoring),
and returns enhanced resume data.
"""

import logging
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List

from services.resume_generator import generate_resume
from services.summary_generator import (
    get_active_provider,
    generate_summary,
    enhance_project,
    enhance_achievement,
)
from services.skills_classifier import classify_skills
from services.project_ranker import rank_projects
from services.achievement_scorer import score_achievements
from services.ats_scorer import compute_ats_score
from config import HOST, PORT

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger("ml-service")

# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AI Resume Builder — ML Service",
    description="Hybrid ML + LLM microservice for intelligent resume generation",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Spring frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request Models
# ---------------------------------------------------------------------------

class StudentInfo(BaseModel):
    name: str = ""
    email: str = ""
    mobile: Optional[int] = None
    skills: List[str] = Field(default_factory=list)
    gitlink: Optional[str] = None
    portfolio: Optional[str] = None


class AcademicInfo(BaseModel):
    course: str = ""
    branch: str = ""
    year: int = 0
    semester: int = 0
    cgpa: float = 0.0
    batch: str = ""
    section: str = ""


class ProjectInfo(BaseModel):
    title: str = ""
    description: str = ""
    role: str = ""
    gitlink: Optional[str] = None
    deploylink: Optional[str] = None


class AchievementInfo(BaseModel):
    title: str = ""
    category: str = ""
    description: str = ""


class ResumeRequest(BaseModel):
    student: StudentInfo
    academics: AcademicInfo
    projects: List[ProjectInfo] = Field(default_factory=list)
    achievements: List[AchievementInfo] = Field(default_factory=list)
    target_role: str = ""
    template: str = "professional"


# ---------------------------------------------------------------------------
# Health Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "service": "AI Resume Builder — ML Service",
        "version": "2.0.0",
        "llm_provider": get_active_provider(),
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "llm_provider": get_active_provider()
    }


# ---------------------------------------------------------------------------
# Main Resume Generator
# ---------------------------------------------------------------------------

@app.post("/generate-resume")
def generate_resume_endpoint(request: ResumeRequest):
    try:
        logger.info(f"Generating resume for: {request.student.email}")

        data = {
            "student": request.student.model_dump(),
            "academics": request.academics.model_dump(),
            "projects": [p.model_dump() for p in request.projects],
            "achievements": [a.model_dump() for a in request.achievements],
            "target_role": request.target_role,
            "template": request.template,
        }

        result = generate_resume(data)
        return result

    except Exception as e:
        logger.error(f"Resume generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# Additional ML Features (All use ResumeRequest)
# ---------------------------------------------------------------------------

@app.post("/classify-skills")
def classify_skills_endpoint(request: ResumeRequest):
    try:
        skills = request.student.skills
        return classify_skills(skills)
    except Exception as e:
        logger.error(f"Skill classification failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/rank-projects")
def rank_projects_endpoint(request: ResumeRequest):
    try:
        projects = [p.model_dump() for p in request.projects]
        return rank_projects(projects, request.target_role)
    except Exception as e:
        logger.error(f"Project ranking failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/score-achievements")
def score_achievements_endpoint(request: ResumeRequest):
    try:
        achievements = [a.model_dump() for a in request.achievements]
        return score_achievements(achievements)
    except Exception as e:
        logger.error(f"Achievement scoring failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ats-score")
def ats_score_endpoint(request: ResumeRequest):
    try:
        resume_data = {
            "student": request.student.model_dump(),
            "academics": request.academics.model_dump(),
            "projects": [p.model_dump() for p in request.projects],
            "achievements": [a.model_dump() for a in request.achievements],
        }

        return compute_ats_score(resume_data, request.target_role)

    except Exception as e:
        logger.error(f"ATS scoring failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/summary")
def summary_endpoint(request: ResumeRequest):
    try:
        data = {
            "student": request.student.model_dump(),
            "academics": request.academics.model_dump(),
            "projects": [p.model_dump() for p in request.projects],
            "achievements": [a.model_dump() for a in request.achievements],
        }

        return {"summary": generate_summary(data)}

    except Exception as e:
        logger.error(f"Summary generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/enhance-project")
def enhance_project_endpoint(request: ResumeRequest):
    try:
        if not request.projects:
            raise HTTPException(status_code=400, detail="No project found")

        project = request.projects[0].model_dump()
        return {"enhanced": enhance_project(project, request.target_role)}

    except Exception as e:
        logger.error(f"Project enhancement failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/enhance-achievement")
def enhance_achievement_endpoint(request: ResumeRequest):
    try:
        if not request.achievements:
            raise HTTPException(status_code=400, detail="No achievement found")

        achievement = request.achievements[0].model_dump()
        return {"enhanced": enhance_achievement(achievement)}

    except Exception as e:
        logger.error(f"Achievement enhancement failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# Main Runner
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    logger.info(f"Starting ML Service on {HOST}:{PORT}")
    logger.info(f"Active LLM provider: {get_active_provider()}")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)