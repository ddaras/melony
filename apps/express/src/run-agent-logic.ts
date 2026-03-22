import type express from "express";
import type { AgentBuilder } from "@melony/agents";
import type { Event } from "melony";
import type { LlmMessage } from "@melony/llm";
import { getSessionMessages, setSessionMessages } from "./session-store.js";

type StreamAgentRunArgs = {
  runAgent: AgentBuilder;
  message: string;
  activeSessionId: string;
  response: express.Response;
};

const writeSseEvent = (response: express.Response, event: Event): void => {
  response.write(`data: ${JSON.stringify(event)}\n\n`);
};

export const streamAgentRun = async ({
  runAgent,
  message,
  activeSessionId,
  response
}: StreamAgentRunArgs): Promise<void> => {
  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Connection", "keep-alive");
  response.flushHeaders();

  const previousMessages = getSessionMessages(activeSessionId);
  const messages: LlmMessage[] = [...previousMessages, { role: "user", content: message }];
  const state = {
    input: message,
    messages,
    sessionId: activeSessionId
  };

  let assistantResponse = "";

  try {
    for await (const event of runAgent.run(message, { state })) {
      if (event.type === "llm:text:delta") {
        const delta = (event.data as { delta?: unknown } | undefined)?.delta;
        if (typeof delta === "string") {
          assistantResponse += delta;
        }
      } else if (event.type === "llm:text" && !assistantResponse) {
        const text = (event.data as { text?: unknown } | undefined)?.text;
        if (typeof text === "string") {
          assistantResponse = text;
        }
      }

      writeSseEvent(response, event as Event);
    }

    if (assistantResponse.trim()) {
      messages.push({ role: "assistant", content: assistantResponse });
      setSessionMessages(activeSessionId, messages);
    } else {
      setSessionMessages(activeSessionId, previousMessages);
    }
  } catch (error) {
    const runtimeErrorEvent: Event = {
      type: "error",
      data: {
        message: error instanceof Error ? error.message : "Unknown agent error"
      }
    };
    writeSseEvent(response, runtimeErrorEvent);
  } finally {
    response.end();
  }
};
