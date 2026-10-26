import os
from pathlib import Path

from dotenv import load_dotenv

# Reuse the keys your Node backend already has (EduVerse/backend/.env),
# plus an optional ML/.env of its own.
_here = Path(__file__).resolve().parent
load_dotenv(_here.parent / "backend" / ".env")
load_dotenv(_here / ".env")

# ---- Which AI writes the text? ----
# Auto-detected the same way your chat.js does it:
#   key starting with "sk-or-v1-"  -> OpenRouter (google/gemini-2.5-flash)
#   any other key                  -> Google Gemini (gemini-2.5-flash)
# Override anything with LLM_PROVIDER / LLM_API_KEY / LLM_MODEL / LLM_BASE_URL.
LLM_API_KEY = (os.getenv("LLM_API_KEY") or os.getenv("OPENROUTER_API_KEY")
               or os.getenv("GEMINI_API_KEY") or "")
_is_openrouter = LLM_API_KEY.startswith("sk-or-v1-")

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai" if _is_openrouter else "gemini").lower()
LLM_MODEL = os.getenv("LLM_MODEL",
                      "google/gemini-2.5-flash" if _is_openrouter else "gemini-2.5-flash")
LLM_BASE_URL = os.getenv("LLM_BASE_URL",
                         "https://openrouter.ai/api/v1" if _is_openrouter else "")

EMBED_MODEL = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")   # runs locally, free

DATA_DIR = os.getenv("DATA_DIR", str(_here / "data"))
SQLITE_PATH = os.path.join(DATA_DIR, "tutor.db")
CHROMA_PATH = os.path.join(DATA_DIR, "chroma")

CHUNK_WORDS = 220      # words per chunk when ingesting documents
CHUNK_OVERLAP = 40     # overlapping words between chunks
TOP_K_DOCS = 5         # knowledge chunks retrieved per query
TOP_K_MEMORY = 4       # past student messages retrieved per query

os.makedirs(DATA_DIR, exist_ok=True)
