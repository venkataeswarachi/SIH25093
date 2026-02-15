import os
from dotenv import load_dotenv

load_dotenv()

# --- LLM Provider Configuration ---
# Set one of these API keys in .env file
# Priority: GROQ > GEMINI > FALLBACK (template-based, no API needed)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Groq model (free tier: llama-3.1-70b-versatile)
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")

# Gemini model (free tier: gemini-1.5-flash)
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# --- ML Model Paths ---
SKILLS_MODEL_PATH = os.getenv("SKILLS_MODEL_PATH", "models/skills_classifier.pkl")
SKILLS_VECTORIZER_PATH = os.getenv("SKILLS_VECTORIZER_PATH", "models/skills_vectorizer.pkl")
ATS_VECTORIZER_PATH = os.getenv("ATS_VECTORIZER_PATH", "models/ats_vectorizer.pkl")

# --- Sentence Transformer ---
SENTENCE_MODEL = os.getenv("SENTENCE_MODEL", "all-MiniLM-L6-v2")

# --- Server ---
HOST = os.getenv("ML_HOST", "0.0.0.0")
PORT = int(os.getenv("ML_PORT", "8000"))
