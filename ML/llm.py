"""Text generator wrapper.

The tutor logic (RAG, personalisation, courses, quizzes) lives in this project.
The actual text is written by YOUR existing AI. Choose it in config / .env:

  LLM_PROVIDER=gemini   -> Google Gemini REST API
  LLM_PROVIDER=openai   -> any OpenAI-compatible API: OpenAI, Groq, OpenRouter,
                           LM Studio, or Ollama (http://localhost:11434/v1)
"""
import json
import re
import time

import requests

from config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL, LLM_PROVIDER

TIMEOUT = 180


def _post(url, headers, payload):
    """POST with a few retries (free tiers often rate-limit with 429/503)."""
    last = None
    for attempt in range(4):
        r = requests.post(url, headers=headers, json=payload, timeout=TIMEOUT)
        if r.status_code in (429, 500, 502, 503):
            last = r
            time.sleep(2 * (attempt + 1))
            continue
        if not r.ok:
            raise RuntimeError(f"LLM request failed ({r.status_code}): {r.text[:500]}")
        return r.json()
    raise RuntimeError(f"LLM busy/rate-limited: {last.status_code} {last.text[:300]}")


def _gemini(system, messages, max_tokens):
    base = LLM_BASE_URL or "https://generativelanguage.googleapis.com/v1beta"
    url = f"{base}/models/{LLM_MODEL}:generateContent"
    config = {"maxOutputTokens": max_tokens}
    if "2.5-flash" in LLM_MODEL:
        # Gemini 2.5 Flash "thinking" tokens eat the output budget and can cut
        # JSON off mid-way; turn thinking off for faster, complete answers.
        config["thinkingConfig"] = {"thinkingBudget": 0}
    payload = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": [{"role": "model" if m["role"] == "assistant" else "user",
                      "parts": [{"text": m["content"]}]} for m in messages],
        "generationConfig": config,
    }
    headers = {"Content-Type": "application/json", "x-goog-api-key": LLM_API_KEY}
    data = _post(url, headers, payload)
    try:
        parts = data["candidates"][0]["content"]["parts"]
    except (KeyError, IndexError):
        raise RuntimeError(f"Unexpected Gemini response: {str(data)[:500]}")
    return "".join(p.get("text", "") for p in parts)


def _openai(system, messages, max_tokens):
    base = (LLM_BASE_URL or "https://api.openai.com/v1").rstrip("/")
    headers = {"Content-Type": "application/json"}
    if LLM_API_KEY:
        headers["Authorization"] = f"Bearer {LLM_API_KEY}"
    payload = {
        "model": LLM_MODEL,
        "messages": [{"role": "system", "content": system}] + messages,
        "max_tokens": max_tokens,
    }
    data = _post(f"{base}/chat/completions", headers, payload)
    try:
        return data["choices"][0]["message"]["content"] or ""
    except (KeyError, IndexError):
        raise RuntimeError(f"Unexpected LLM response: {str(data)[:500]}")


def complete(system: str, user: str | None = None, max_tokens: int = 2000,
             messages: list | None = None) -> str:
    msgs = messages if messages is not None else [{"role": "user", "content": user}]
    if LLM_PROVIDER == "gemini":
        return _gemini(system, msgs, max_tokens)
    if LLM_PROVIDER == "openai":
        return _openai(system, msgs, max_tokens)
    raise RuntimeError(f"Unknown LLM_PROVIDER '{LLM_PROVIDER}' (use 'gemini' or 'openai')")


def complete_json(system: str, user: str, max_tokens: int = 3000):
    """Ask for JSON only and parse it, tolerating code fences and extra prose."""
    text = complete(system + "\nRespond with valid JSON only, no prose, no code fences.",
                    user, max_tokens)
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end > start:
            return json.loads(text[start:end + 1])
        raise
