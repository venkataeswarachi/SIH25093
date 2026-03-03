import streamlit as st
import json, sys, os

# add ml-service directory to path so we can import services
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from services.skills_classifier import classify_skills
from services.project_ranker import rank_projects
from services.achievement_scorer import score_achievements
from services.ats_scorer import compute_ats_score
from services.summary_generator import (
    generate_summary,
    enhance_project,
    enhance_achievement,
    get_active_provider,
)
from services.resume_generator import generate_resume

st.title("ML Service Playground")

st.sidebar.header("Available FastAPI routes")
st.sidebar.markdown(
    """
- **GET** `/`  – service info
- **GET** `/health`  – health check
- **POST** `/generate-resume`  – main resume generation endpoint
- **POST** `/generate-resume-legacy`  – legacy prompt-based summary
"""
)

provider = get_active_provider()
st.write("**Active LLM provider:**", provider)

# create tabs for each feature
tabs = st.tabs([
    "Skills",
    "Projects",
    "Achievements",
    "ATS",
    "LLM Summary",
    "Resume",
])

with tabs[0]:
    st.header("Skills Classifier")
    raw = st.text_area("Enter comma-separated skills", "python, react, aws")
    if st.button("Classify Skills"):
        skills = [s.strip() for s in raw.split(",") if s.strip()]
        st.json(classify_skills(skills))

with tabs[1]:
    st.header("Project Ranker")
    txt = st.text_area(
        "Projects (JSON list)",
        '[{"title":"Project1","description":"A web app","role":"developer"}]',
    )
    role = st.text_input("Target role")
    if st.button("Rank Projects"):
        try:
            projects = json.loads(txt)
            st.json(rank_projects(projects, role))
        except Exception as e:
            st.error(e)

with tabs[2]:
    st.header("Achievement Scorer")
    txt = st.text_area(
        "Achievements (JSON list)",
        '[{"title":"Won hackathon","category":"competition","description":"Won first place in 100+ teams"}]',
    )
    if st.button("Score Achievements"):
        try:
            achievements = json.loads(txt)
            st.json(score_achievements(achievements))
        except Exception as e:
            st.error(e)

with tabs[3]:
    st.header("ATS Compatibility")
    txt = st.text_area(
        "Resume data (JSON)",
        '{"student":{},"academics":{},"projects":[],"achievements":[]}',
    )
    role = st.text_input("Target role for ATS")
    if st.button("Compute ATS Score"):
        try:
            data = json.loads(txt)
            st.json(compute_ats_score(data, role))
        except Exception as e:
            st.error(e)

with tabs[4]:
    st.header("LLM Summary & Enhancements")
    data_txt = st.text_area(
        "Resume data (JSON)",
        '{"student":{"name":"Jane Doe"},"academics":{},"projects":[],"achievements":[]}',
    )
    if st.button("Generate Summary"):
        try:
            data = json.loads(data_txt)
            st.write(generate_summary(data))
        except Exception as e:
            st.error(e)

    st.subheader("Enhance Single Project")
    proj_txt = st.text_area(
        "Project JSON",
        '{"title":"Project1","description":"Built a web app","role":"developer"}',
        key="proj",
    )
    role2 = st.text_input("Target role (for project)", key="projrole")
    if st.button("Enhance Project"):
        try:
            proj = json.loads(proj_txt)
            st.write(enhance_project(proj, role2))
        except Exception as e:
            st.error(e)

    st.subheader("Enhance Single Achievement")
    ach_txt = st.text_area(
        "Achievement JSON",
        '{"title":"Hackathon Winner","category":"competition","description":"First place among 200+ teams"}',
        key="ach",
    )
    if st.button("Enhance Achievement"):
        try:
            ach = json.loads(ach_txt)
            st.write(enhance_achievement(ach))
        except Exception as e:
            st.error(e)

with tabs[5]:
    st.header("Full Resume Generation")
    req_txt = st.text_area(
        "Resume request JSON",
        '{"student":{},"academics":{},"projects":[],"achievements":[],"target_role":"","template":"professional"}',
    )
    if st.button("Generate Resume"):
        try:
            req = json.loads(req_txt)
            st.json(generate_resume(req))
        except Exception as e:
            st.error(e)

# footer
st.markdown("---")
st.caption("Run this app with `streamlit run streamlit_app.py` inside the ml-service folder.")