import { Router } from "express";
import { mlUrl } from "../mlClient.js";

// Forwards everything under /api/ml/* to the Python ML service, e.g.
//   POST /api/ml/courses                          -> create a course outline
//   POST /api/ml/courses/:id/lessons/:m/:l        -> write one lesson
//   POST /api/ml/courses/:id/generate-all         -> write every lesson
//   GET  /api/ml/courses/:id                      -> read the course
//   POST /api/ml/quizzes                          -> create a quiz
//   POST /api/ml/quizzes/:id/submit               -> grade a quiz
//   GET  /api/ml/students/:id/progress            -> quiz history + weak concepts
//   POST /api/ml/knowledge/text                   -> (form fields) add study material
const router = Router();

router.use(async (req, res) => {
  try {
    const hasBody = !["GET", "HEAD"].includes(req.method);
    const response = await fetch(`${mlUrl()}${req.url}`, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
      signal: AbortSignal.timeout(180000), // lessons can take a while to write
    });
    const text = await response.text();
    return res.status(response.status).type("application/json").send(text);
  } catch (error) {
    console.error("ML service request failed:", error);
    return res.status(502).json({
      error: "The ML service is not reachable. Start it with: python -m uvicorn main:app --reload (in the ML folder).",
    });
  }
});

export default router;
