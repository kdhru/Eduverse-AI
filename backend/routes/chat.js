import { Router } from "express";
import { randomUUID } from "node:crypto";
import {
  getTutorConversation,
  listTutorConversations,
  saveTutorResponse,
} from "../database.js";
import { getContext, rememberExchange } from "../mlClient.js";

const router = Router();
const GEMINI_MODEL = "gemini-2.5-flash";
const OPENROUTER_MODEL = "google/gemini-2.5-flash";

router.get("/history", async (_req, res) => {
  try {
    const conversations = await listTutorConversations();
    return res.json({ conversations });
  } catch (error) {
    console.error("Unable to load tutor history:", error);
    return res.status(503).json({ error: "Unable to load tutor history." });
  }
});

router.get("/history/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  if (conversationId.length > 100) {
    return res.status(400).json({ error: "Invalid conversation ID." });
  }

  try {
    const records = await getTutorConversation(conversationId);
    if (records.length === 0) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    const messages = records.flatMap((record) => [
      { role: "user", content: record.prompt },
      { role: "ai", content: record.response },
    ]);
    return res.json({ id: conversationId, messages });
  } catch (error) {
    console.error("Unable to load tutor conversation:", error);
    return res.status(503).json({ error: "Unable to load this conversation." });
  }
});

router.post("/", async (req, res) => {
  // studentId: send your logged-in user's id from the frontend; falls back to one shared profile.
  const { history, userMemory = "", conversationId, studentId = "default" } = req.body ?? {};

  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "A non-empty conversation history is required." });
  }

  if (typeof userMemory !== "string") {
    return res.status(400).json({ error: "userMemory must be a string." });
  }

  if (
    conversationId !== undefined &&
    (typeof conversationId !== "string" || conversationId.length === 0 || conversationId.length > 100)
  ) {
    return res.status(400).json({ error: "conversationId must be a non-empty string no longer than 100 characters." });
  }
  const activeConversationId = conversationId ?? randomUUID();

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "Tutor is not configured. Set OPENROUTER_API_KEY or GEMINI_API_KEY in backend/.env.",
    });
  }
  const useOpenRouter = apiKey.startsWith("sk-or-v1-");

  const contents = [];
  for (const message of history) {
    if (
      !message ||
      !["user", "assistant"].includes(message.role) ||
      typeof message.content !== "string"
    ) {
      return res.status(400).json({ error: "Each history item must have a valid role and text content." });
    }

    const parts = [{ text: message.content }];
    if (message.image !== undefined) {
      if (typeof message.image !== "string") {
        return res.status(400).json({ error: "Image data must be a data URL string." });
      }

      const match = message.image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
      if (!match) {
        return res.status(400).json({ error: "The attached image is not a valid base64 data URL." });
      }
      parts.push({ inline_data: { mime_type: match[1], data: match[2] } });
    }

    contents.push({
      role: message.role === "assistant" ? "model" : "user",
      parts,
    });
  }

  const prompt = [...history].reverse().find((message) => message.role === "user")?.content;

  // Ask the Python ML service for relevant course material + this student's earlier chats (RAG).
  const ml = prompt ? await getContext(String(studentId), prompt) : null;
  const mlContext = ml
    ? `\n\nWhat this student has asked and learned before:\n${ml.profile}` +
      `\n\nRelevant course material (cite as [n] when you use it):\n${ml.material || "(none found)"}`
    : "";

  const systemInstruction =
    (userMemory
      ? `You are a helpful, patient study tutor. Use this learner context when relevant:\n${userMemory}`
      : "You are a helpful, patient study tutor.") + mlContext;

  try {
    const response = useOpenRouter
      ? await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            max_tokens: 2048,
            messages: [
              { role: "system", content: systemInstruction },
              ...contents.map((message) => ({
                role: message.role === "model" ? "assistant" : "user",
                content: message.parts.some((part) => part.inline_data)
                  ? message.parts.map((part) => part.inline_data
                      ? {
                          type: "image_url",
                          image_url: {
                            url: `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`,
                          },
                        }
                      : { type: "text", text: part.text })
                  : message.parts.map((part) => part.text ?? "").join(""),
              })),
            ],
          }),
        })
      : await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemInstruction }] },
              contents,
            }),
          },
        );

    const data = await response.json();
    if (!response.ok) {
      const providerMessage = data.error?.message ?? response.statusText;
      const provider = useOpenRouter ? "OpenRouter" : "Gemini";
      console.error(`${provider} request failed (${response.status}): ${providerMessage}`);
      return res.status(502).json({
        error: `${provider} rejected the request: ${providerMessage}`,
      });
    }

    const reply = useOpenRouter
      ? data.choices?.[0]?.message?.content?.trim()
      : data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("")
          .trim();

    if (!reply) {
      return res.status(502).json({ error: "The tutor provider returned an empty response." });
    }

    // Let the ML service learn from this exchange (not awaited, never blocks the reply).
    if (prompt) void rememberExchange(String(studentId), prompt, reply);

    try {
      await saveTutorResponse({
        conversationId: activeConversationId,
        prompt,
        response: reply,
        model: useOpenRouter ? OPENROUTER_MODEL : GEMINI_MODEL,
        provider: useOpenRouter ? "openrouter" : "google",
        createdAt: new Date(),
      });
      return res.json({ reply, saved: true, conversationId: activeConversationId });
    } catch (error) {
      console.error("Unable to save tutor response to MongoDB:", error);
      return res.json({
        reply,
        saved: false,
        conversationId: activeConversationId,
        warning: "The answer was generated but could not be saved to the database.",
      });
    }
  } catch (error) {
    console.error(`Unable to reach ${useOpenRouter ? "OpenRouter" : "Gemini"}:`, error);
    return res.status(502).json({ error: "Unable to reach the tutor provider." });
  }
});

export default router;
