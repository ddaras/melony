import express from "express";
import { defaultChatAgent, sequentialChatAgent } from "./agents.js";
import { resolveSessionId, getSessionMessages, setSessionMessages } from "./session-store.js";
import { validateMessage } from "./utils.js";
import { generateId, ErrorEvent } from "melony";
import { runManager } from "./runs.js";

type RunRequestBody = {
  event?: {
    data?: {
      text?: unknown;
    };
  };
  threadId?: unknown;
  sessionId?: unknown;
  agentType?: "default" | "sequential";
};

export const registerChatRoutes = (app: express.Express): void => {
  app.get("/health", (req, res) => {
    res.json({ status: "healthy", version: "0.0.1", platform: "melony" });
  });

  app.post("/runs", async (req, res) => {
    const { event, sessionId, threadId, agentType } = req.body as RunRequestBody;
    const activeThreadId = (threadId || resolveSessionId(sessionId)) as string;
    const message = event?.data?.text;

    if (!validateMessage(message, res)) {
      return;
    }

    const agent = agentType === "sequential" ? sequentialChatAgent : defaultChatAgent;
    const run = runManager.createRun(activeThreadId);

    res.json({ runId: run.id, threadId: activeThreadId, status: "running" });

    // Background run
    (async () => {
      runManager.updateRunStatus(run.id, "running");
      const previousMessages = getSessionMessages(activeThreadId);
      const messages = [...previousMessages, { role: "user" as const, content: message as string }];
      
      const state = {
        input: message,
        messages,
        threadId: activeThreadId
      };

      let assistantResponse = "";

      try {
        for await (const agentEvent of agent.run(message as string, { state })) {
          if (agentEvent.type === "llm:text:delta") {
            const delta = (agentEvent.data as { delta?: string } | undefined)?.delta;
            if (delta) assistantResponse += delta;
          } else if (agentEvent.type === "llm:text" && !assistantResponse) {
            const text = (agentEvent.data as { text?: string } | undefined)?.text;
            if (text) assistantResponse = text;
          }
          runManager.emitEvent(run.id, agentEvent);
        }

        if (assistantResponse.trim()) {
          messages.push({ role: "assistant" as const, content: assistantResponse });
          setSessionMessages(activeThreadId, messages);
        }
        runManager.updateRunStatus(run.id, "completed");
      } catch (error) {
        console.error(`Run ${run.id} failed:`, error);
        const runtimeErrorEvent: ErrorEvent = {
          type: "error",
          data: {
            message: error instanceof Error ? error.message : "Unknown agent error"
          }
        };
        runManager.emitEvent(run.id, runtimeErrorEvent);
        runManager.updateRunStatus(run.id, "failed");
      }
    })();
  });

  app.get("/runs", (req, res) => {
    const { threadId } = req.query;
    const runs = runManager.listRuns({ 
      threadId: threadId as string 
    });
    res.json({ runs });
  });

  app.get("/threads", (req, res) => {
    const threadIds = runManager.listThreads();
    const threads = threadIds.map(id => ({ id }));
    res.json({ threads });
  });

  app.get("/stream", (req, res) => {
    const { runId, threadId } = req.query;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const filter = { runId: runId as string, threadId: threadId as string };
    
    // Optional: Send historical events first if requested, or just start streaming new ones.
    // The user contract says "stream events from specific runId or threadId".
    // Usually SSE streams start with current state or just new events.
    // I'll include historical events to be helpful, as the previous implementation did.
    const historicalEvents = runManager.getEvents(filter);
    for (const event of historicalEvents) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    // Real-time events
    const unsubscribe = runManager.subscribe(filter, (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    req.on("close", () => {
      unsubscribe();
      res.end();
    });
  });

  app.get("/events", (req, res) => {
    const { runId, threadId } = req.query;
    const filter = { runId: runId as string, threadId: threadId as string };
    const events = runManager.getEvents(filter);
    res.json({ events });
  });
};
