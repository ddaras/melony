import express from "express";
import { defaultChatAgent, sequentialChatAgent } from "./agents.js";
import { resolveSessionId } from "./session-store.js";
import { streamAgentRun } from "./run-agent-logic.js";
import { validateMessage } from "./utils.js";

type ChatRequestBody = {
  event?: {
    data?: {
      text?: unknown;
    };
  };
  sessionId?: unknown;
};

export const registerChatRoutes = (app: express.Express): void => {
  app.post("/chat", async (req, res) => {
    const { event, sessionId } = req.body as ChatRequestBody;
    const activeSessionId = resolveSessionId(sessionId);
    const message = event?.data?.text;

    if (!validateMessage(message, res)) {
      return;
    }

    await streamAgentRun({
      runAgent: defaultChatAgent,
      message,
      activeSessionId,
      response: res
    });
  });

  app.post("/chat/sequential", async (req, res) => {
    const { event, sessionId } = req.body as ChatRequestBody;
    const activeSessionId = resolveSessionId(sessionId);
    const message = event?.data?.text;

    if (!validateMessage(message, res)) {
      return;
    }

    await streamAgentRun({
      runAgent: sequentialChatAgent,
      message,
      activeSessionId,
      response: res
    });
  });
};
