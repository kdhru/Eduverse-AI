// Small helper for talking to the Python ML service (EduVerse/ML).
// Read lazily so a value set in backend/.env (loaded after imports) is honoured.
export const mlUrl = () => process.env.ML_URL || "http://127.0.0.1:8000";

async function mlPost(path, body, timeoutMs = 8000) {
  const response = await fetch(`${mlUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    throw new Error(`ML service responded ${response.status}`);
  }
  return response.json();
}

// Relevant course material + what this student asked before.
// Never throws: if the ML service is down, chat still works without it.
export async function getContext(studentId, query) {
  try {
    return await mlPost("/context", { student_id: studentId, query });
  } catch (error) {
    console.warn("ML context unavailable:", error instanceof Error ? error.message : error);
    return null;
  }
}

// Save a finished exchange so future answers can use it. Fire-and-forget.
export async function rememberExchange(studentId, prompt, response) {
  try {
    await mlPost("/memory", { student_id: studentId, prompt, response });
  } catch (error) {
    console.warn("ML memory not saved:", error instanceof Error ? error.message : error);
  }
}
