import express from "express";
import { fileURLToPath } from "node:url";

import { expressAgent } from "./agent";
import type { ChatEvent, ChatRequest } from "./types";

const PORT = Number(process.env.PORT ?? 4001);
const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "Melony Express demo server",
    chatEndpoint: "/api/chat",
    stream: "Server-Sent Events (SSE)",
  });
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

  const runtime = expressAgent.build();
  const iterator = runtime.run(body.event as ChatEvent, {
    runId: body.runId,
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
    console.log(`Melony Express server listening at http://localhost:${PORT}`);
  });
}

export { app };
