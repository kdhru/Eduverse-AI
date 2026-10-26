import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import chatRouter from "./routes/chat.js"; // <- the router file you pasted
import mlRouter from "./routes/ml.js"; // courses, quizzes, progress (Python ML service)
import { connectDatabase } from "./database.js";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // allows base64 images

// Mount the router: POST http://localhost:5000/api/chat
app.use("/api/chat", chatRouter);

// Mount the ML router: e.g. POST http://localhost:5000/api/ml/courses
app.use("/api/ml", mlRouter);

const PORT = process.env.PORT || 5000;

connectDatabase().catch((error) => {
  console.error(
    "MongoDB is unavailable; tutor answers will not be saved until it reconnects:",
    error instanceof Error ? error.message : error,
  );
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));