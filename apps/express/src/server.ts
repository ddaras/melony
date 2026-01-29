#!/usr/bin/env node
import "dotenv/config";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";

import { createOpenBot } from "./agent.js";
import { loadConfig } from "./config.js";
import type { ChatEvent, ChatRequest, ChatState } from "./types.js";

const config = loadConfig();
const PORT = Number(config.port ?? process.env.PORT ?? 4001);
const app = express();

// In-memory state store (use a real database for production)
const stateStore = new Map<string, ChatState>();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({
    message: "Melony Express demo server",
    chatEndpoint: "/api/chat",
    stream: "Server-Sent Events (SSE)",
  });
});

app.get<{ platform: string }>("/api/init", async (req, res) => {
  const platform = req.query.platform || "web";
  const openBot = await createOpenBot();

  const response = await openBot.jsonResponse({
    type: "init",
    data: { platform }
  } as any);

  res.json(await response.json());
});

app.post("/api/chat", async (req, res) => {
  const body = req.body as Partial<ChatRequest>;

  if (!body.event || typeof body.event.type !== "string") {
    return res.status(400).json({
      error: "The request body must contain an `event` with a string `type`.",
    });
  }

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  res.flushHeaders?.();

  const openBot = await createOpenBot();
  const runtime = openBot.build();

  const runId = body.runId ?? "default";
  const state = stateStore.get(runId) ?? {};

  const iterator = runtime.run(body.event as ChatEvent, {
    runId,
    state,
  });

  const stopStreaming = () => {
    iterator.return?.({ done: true, value: undefined });
  };

  res.on("close", stopStreaming);

  try {
    for await (const chunk of iterator) {
      if (res.writableEnded) {
        break;
      }
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    // After the run finishes, the state might have been updated by plugins
    stateStore.set(runId, state);
  } catch (error) {
    console.error("Melony stream error:", error);
    if (!res.writableEnded) {
      res.write(
        `event: error\ndata: ${JSON.stringify({
          message: error instanceof Error ? error.message : String(error),
        })}\n\n`
      );
    }
  } finally {
    res.off("close", stopStreaming);
    if (!res.writableEnded) {
      res.write("event: done\ndata: {}\n\n");
      res.end();
    }
  }
});

const currentModule = fileURLToPath(import.meta.url);
const isMain = process.argv[1] === currentModule;

if (isMain) {
  app.listen(PORT, () => {
    console.log(`OpenBot server listening at http://localhost:${PORT}`);
    console.log(`  - Chat endpoint: POST /api/chat`);
  });
}

export { app };
