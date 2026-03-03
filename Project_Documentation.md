# SIH25093 — Detailed Project Documentation

## Table of Contents
1. Project Summary
2. Prerequisites and Setup (step-by-step)
3. Component: Frontend (detailed)
4. Component: ML Service (detailed)
5. Component: University Backend (detailed)
6. File-by-file Reference (selected important files)
7. Environment variables and samples
8. Training and model artifacts
9. Troubleshooting & Notes
10. Contact / Next Steps

---

## 1. Project Summary

This repository implements a centralized digital platform for student activity records and an AI Resume Builder microservice. The three main components are:
- A React-based frontend providing student, faculty, and admin interfaces.
- A Spring Boot backend (`University`) handling authentication, persistence, and business logic.
- An ML microservice (`ml-service`) that transforms structured student data into AI-enhanced resumes using a mix of pre-trained ML models and LLM providers (Groq, Gemini) with safe fallbacks.

## 2. Prerequisites and Setup (step-by-step)

**System requirements (recommended):** Windows, macOS or Linux with:
- Node.js 18+ and npm
- Python 3.11+ and pip
- Java 17 (OpenJDK) and Maven

**Quick setup summary:**

1) Frontend
```bash
cd frontend
npm install
npm run dev
```

2) ML Service
```bash
cd ml-service
python -m venv .venv
# Windows
.venv\Scripts\activate
# Unix
# source .venv/bin/activate
pip install -r requirements.txt
# create .env with LLM keys (see Section 7)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

3) Backend (University)
```bash
cd University
# configure src/main/resources/application.properties with DB credentials
mvn spring-boot:run
```

## 3. Component: Frontend (detailed)

**Location:** `frontend/`

**Stack:** React 19, Vite, Axios. ESLint config present. Project entry: `src/main.jsx` mounts `App` inside an `AuthProvider` and `BrowserRouter` for routing and auth context.

**Key files and roles:**
- `src/main.jsx`: application entrypoint; wraps `App` with `AuthProvider` and `BrowserRouter`.
- `src/App.jsx`: central route definitions and RBAC routing. Redirects root to role-appropriate dashboards.
- `src/services/api.js`: Axios instance; default `baseURL` is `http://127.0.0.1:2008` (change to match backend). Attaches JWT from `localStorage` in requests.
- `src/auth/AuthContext.jsx`: authentication provider (token handling, login/logout flows) — used by components via `useAuth()`.
- `src/layout/`: layout components: `AuthLayout`, `MainLayout`, `AdminLayout`.
- `src/pages/`: per-role pages grouped under `admin/`, `faculty/`, `student/`, and `common/`.

**Development notes (frontend):**
- Update `src/services/api.js` `baseURL` to point to Spring Boot backend (default port in code is `2008`).
- JWT token is expected in `localStorage` as `token` and will be appended automatically.

## 4. Component: ML Service (detailed)

**Location:** `ml-service/`

Overview: FastAPI application that orchestrates several internal services to produce a feature-rich resume payload. It blends ML models (skills classifier, project ranker, ATS scorer) with LLM calls (Groq → Gemini) and template fallbacks.

**Important modules and behavior:**
- `main.py`: FastAPI app. Defines Pydantic models and endpoints: `/`, `/health`, `/generate-resume`, `/generate-resume-legacy`.
- `config.py`: loads environment variables using `python-dotenv`. Key variables: `GROQ_API_KEY`, `GEMINI_API_KEY`, `GROQ_MODEL`, `GEMINI_MODEL`, `SKILLS_MODEL_PATH`, `SKILLS_VECTORIZER_PATH`, `SENTENCE_MODEL`, `ML_HOST`, `ML_PORT`.
- `requirements.txt`: runtime dependencies (FastAPI, uvicorn, scikit-learn, sentence-transformers, numpy, joblib, httpx, python-dotenv, groq, google-generativeai).
- `services/` folder components:
  - `resume_generator.py`: orchestrator that calls classification, ranking, scoring, summary generation, and ATS scoring to assemble final resume JSON.
  - `summary_generator.py`: encapsulates LLM provider calls (Groq client via `groq`, Gemini via `google.generativeai`) and implements a fallback chain and template-based fallback functions.
  - `skills_classifier.py`: rule-based taxonomy with optional ML model loading via `joblib`.
  - `project_ranker.py`: ranks projects by relevance to a target role using sentence-transformers embeddings.
  - `achievement_scorer.py`: scores achievements heuristically.
  - `ats_scorer.py`: computes ATS match statistics vs target role keywords.

**Templates and prompts:**
- `templates/prompts.py`: prompt templates for LLM calls and fallback text generation; contains action verbs, tech regexes and prompt builders.

**Model artifacts and training:**
- `models/`: expected location for `skills_classifier.pkl`, `skills_vectorizer.pkl`, `ats_vectorizer.pkl` etc. Paths configurable via `.env`.
- `training/train_skills_model.py`: script to train and export TF-IDF/vectorizer + classifier.

**Running notes:**
- Start via `uvicorn main:app --host 0.0.0.0 --port 8000 --reload` or `python main.py`.
- Ensure `.env` contains at least one LLM API key (Groq preferred). If no key is present, the service uses template fallbacks in `templates/prompts.py`.

## 5. Component: University Backend (detailed)

**Location:** `University/`

This Spring Boot application holds core business logic and persistence.

**Key files and structure:**
- `pom.xml`: declares dependencies and Java version (17). Notable dependencies: `spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `mysql-connector-j`, `jjwt`, `poi-ooxml`.
- `src/main/java/com/vvit/University/UniversityApplication.java`: Spring Boot main class (application entry point).
- `src/main/resources/application.properties`: runtime config — DB connection, server port, JWT secrets (not committed); adjust per environment.

**Common tasks:**
- To run locally: `mvn spring-boot:run` (ensure `JAVA_HOME` points to JDK17 and DB is running with configured credentials).
- The backend exposes REST endpoints consumed by the React frontend; it may call the ML service at `http://<ml-host>:<ml-port>/generate-resume`.

## 6. File-by-file Reference (selected important files)

Concise descriptions of key files (use this section to quickly understand responsibilities):

### Frontend files
- `frontend/src/main.jsx` — bootstraps the React app; wraps `App` with `AuthProvider` and `BrowserRouter`.
- `frontend/src/App.jsx` — route definitions for Student/Faculty/Admin; uses `MainLayout` and `AuthLayout`.
- `frontend/src/services/api.js` — Axios client with `baseURL` and auth interceptor.
- `frontend/src/auth/AuthContext.jsx` — provides `useAuth()` hook; manages `user` and `token`.
- `frontend/src/pages/student/ResumeGenerator.jsx` — UI that collects inputs and triggers resume generation flow.

### ML Service files
- `ml-service/main.py` — FastAPI application and endpoint definitions; Pydantic models for validation.
- `ml-service/config.py` — environment-driven configuration constants.
- `ml-service/requirements.txt` — dependency manifest for the Python service.
- `ml-service/services/resume_generator.py` — orchestrates classification, ranking, LLM summary/enhancements, and ATS scoring to return final resume JSON (see function `generate_resume`).
- `ml-service/services/summary_generator.py` — wrapper around LLM providers with fallback to template-based generation; important function: `_call_llm(system, user_prompt)`.
- `ml-service/services/skills_classifier.py` — rule-based taxonomy and optional ML model load via `joblib`; function `classify_skills(skills: list[str])` returns categorized skills.
- `ml-service/templates/prompts.py` — contains prompt-builder functions (`build_summary_prompt`, `build_project_enhancement_prompt`, etc.), action verb banks, and regex patterns used across the service.

### Backend files
- `University/pom.xml` — Maven project descriptor, dependencies, plugin for Spring Boot.
- `University/src/main/java/com/vvit/University/UniversityApplication.java` — Spring Boot launcher class.
- `University/src/main/resources/application.properties` — environment-specific properties (DB, jwt, server.port).

## 7. Environment variables and samples

**`ml-service/.env` (example):**
```
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-70b-versatile
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
ML_HOST=0.0.0.0
ML_PORT=8000
SKILLS_MODEL_PATH=models/skills_classifier.pkl
SKILLS_VECTORIZER_PATH=models/skills_vectorizer.pkl
ATS_VECTORIZER_PATH=models/ats_vectorizer.pkl
SENTENCE_MODEL=all-MiniLM-L6-v2
```

**`University/src/main/resources/application.properties` (example):**
```
spring.datasource.url=jdbc:mysql://localhost:3306/university_db
spring.datasource.username=dbuser
spring.datasource.password=dbpass
jwt.secret=your_jwt_secret
server.port=2008
```

> Note: Do not commit secrets to VCS. Use `.env` and secure vaults in production.

## 8. Training and model artifacts

Training scripts are in `ml-service/training/`. Output artifacts (pickled `joblib` files) go to `ml-service/models/` and paths can be changed via `config.py` or `.env`.

If models are missing:
- The service continues to operate using rule-based taxonomy and template fallbacks (reduced quality but functional).

## 9. Troubleshooting & Notes

- LLM calls may fail if API keys are absent or rate-limited; service falls back to templates.
- If `joblib` model files fail to load, `skills_classifier` uses the in-code taxonomy.
- Ensure `frontend/src/services/api.js` `baseURL` matches the backend address; mismatch is a common cause of frontend errors.
- For CORS problems, enable appropriate origins in Spring Boot and FastAPI CORS settings during development.

## 10. Contact / Next Steps

I can perform next steps on request:
- Convert this Markdown into `.docx` and add to the repo.
- Add `ml-service/.env.example` and `University/application.properties.example` to the repo.
- Generate example API payloads and Postman collection for the endpoints.

---

*Generated by an automated documentation update. For additions, open an issue or request the changes and I will update the doc.*
