import dotenv from "dotenv";
import { createGeminiProvider } from "@melony/gemini";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

export const geminiProvider = createGeminiProvider({
  apiKey: GEMINI_API_KEY,
  model: GEMINI_MODEL
});

export const PORT = process.env.PORT || 3000;
