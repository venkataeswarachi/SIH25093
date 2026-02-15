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
from typing import Optional
from services.resume_generator import generate_resume
from services.summary_generator import get_active_provider
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
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------------------------

class StudentInfo(BaseModel):
    name: str = ""
    email: str = ""
    mobile: Optional[int] = None
    skills: list[str] = Field(default_factory=list)
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
    projects: list[ProjectInfo] = Field(default_factory=list)
    achievements: list[AchievementInfo] = Field(default_factory=list)
    target_role: str = ""
    template: str = "professional"


# Legacy request model (backward compat with old MLClient)
class LegacyRequest(BaseModel):
    prompt: str = ""


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "service": "AI Resume Builder — ML Service",
        "version": "1.0.0",
        "llm_provider": get_active_provider(),
        "status": "running",
    }


@app.get("/health")
def health():
    return {"status": "ok", "llm_provider": get_active_provider()}


@app.post("/generate-resume")
def generate_resume_endpoint(request: ResumeRequest):
    """
    Main endpoint — receives structured student data, returns AI-enhanced resume.
    """
    try:
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
        raise HTTPException(status_code=500, detail=f"Resume generation failed: {str(e)}")


@app.post("/generate-resume-legacy")
def generate_resume_legacy(request: LegacyRequest):
    """
    Legacy endpoint for backward compatibility with old MLClient.
    Accepts a prompt string and returns a basic summary.
    """
    try:
        from services.summary_generator import _call_llm
        from templates.prompts import SYSTEM_PROMPT

        result = _call_llm(SYSTEM_PROMPT, request.prompt)
        if not result:
            result = f"Motivated student seeking opportunities. {request.prompt}"

        return {"resume_text": result}

    except Exception as e:
        logger.error(f"Legacy generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    logger.info(f"Starting ML Service on {HOST}:{PORT}")
    logger.info(f"Active LLM provider: {get_active_provider()}")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
