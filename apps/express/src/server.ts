#!/usr/bin/env node
import "dotenv/config";
import express from "express";
import cors from "cors";
import { Command } from "commander";

import { generateId } from "melony";
import { createOpenBot } from "./agent.js";
import { loadConfig } from "./config.js";
import { loadSession, saveSession, logEvent } from "./session.js";
import type { ChatEvent, ChatRequest } from "./types.js";

const program = new Command();

program
  .name("openbot-server")
  .description("OpenBot server")
  .option("-p, --port <number>", "Port to listen on")
  .option("--openai-api-key <key>", "OpenAI API Key")
  .option("--anthropic-api-key <key>", "Anthropic API Key")
  .action(async (options) => {
    const config = loadConfig();
    const PORT = Number(options.port ?? config.port ?? process.env.PORT ?? 4001);
    const app = express();

    // Initialize the bot instance once at startup
    const openBot = await createOpenBot({
      openaiApiKey: options.openaiApiKey,
      anthropicApiKey: options.anthropicApiKey,
    });

    app.use(cors());
    app.use(express.json());

    app.get("/", async (req, res) => {
      res.json({
        message: "Melony Express demo server",
        chatEndpoint: "/api/chat",
        stream: "Server-Sent Events (SSE)",
      });
    });

    // Init endpoint
    app.get<{ platform: string }>("/api/init", async (req, res) => {
      const platform = req.query.platform || "web";
      const sessionId = req.query.sessionId as string || "default";
      const state = await loadSession(sessionId) ?? {};

      const response = await openBot.jsonResponse({
        type: "init",
        data: { platform }
      } as any, {
        state,
        runId: generateId()
      });

      const result = await response.json();
      // Save state in case init handler modified it
      await saveSession(sessionId, state);
      
      res.json(result);
    });

    // Chat endpoint
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

      const runtime = openBot.build();

      const sessionId = body.sessionId ?? "default";
      const runId = body.runId ?? `run_${generateId()}`;
      const state = await loadSession(sessionId) ?? {};

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
          // Log each event to the persistent file
          // await logEvent(sessionId, runId, chunk);
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
        // After the run finishes, save the final state back to disk
        await saveSession(sessionId, state);
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

    app.listen(PORT, () => {
      console.log(`OpenBot server listening at http://localhost:${PORT}`);
      console.log(`  - Chat endpoint: POST /api/chat`);
      if (options.openaiApiKey) console.log("  - Using OpenAI API Key from CLI");
      if (options.anthropicApiKey) console.log("  - Using Anthropic API Key from CLI");
    });
  });

program.parse();
