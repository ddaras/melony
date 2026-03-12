import express from "express";
import { agent } from "@melony/agents";
import { llm, LlmProviderEvent, LlmProvider, LlmMessage, LlmTool } from "@melony/llm";
import { actions, defineAction } from "@melony/actions";
import { inspector } from "@melony/inspector";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

type OpenAiToolCallAccumulator = {
  id?: string;
  name?: string;
  arguments: string;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const toOpenAiMessages = (messages: LlmMessage[], system?: string) => {
  const openAiMessages: Array<{ role: string; content?: string; tool_call_id?: string; name?: string }> = [];

  if (system) {
    openAiMessages.push({ role: "system", content: system });
  }

  for (const message of messages) {
    if (message.role === "tool") {
      openAiMessages.push({
        role: "tool",
        content: message.content,
        tool_call_id: message.toolCallId,
        name: message.name
      });
      continue;
    }

    openAiMessages.push({
      role: message.role,
      content: message.content
    });
  }

  return openAiMessages;
};

const toOpenAiTools = (tools: LlmTool[] = []) =>
  tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));

const openAiProvider: LlmProvider = {
  name: "openai-chat-completions",
  async *generate(args) {
    if (!OPENAI_API_KEY) {
      yield {
        type: "error",
        error: 'Missing OPENAI_API_KEY. Set it in your environment before calling /chat.'
      } as LlmProviderEvent;
      return;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: toOpenAiMessages(args.messages, args.system),
        tools: toOpenAiTools(args.tools),
        temperature: args.temperature,
        max_tokens: args.maxOutputTokens,
        stream: true
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      yield {
        type: "error",
        error: `OpenAI request failed (${response.status}): ${errorBody}`
      } as LlmProviderEvent;
      return;
    }

    if (!response.body) {
      yield { type: "error", error: "OpenAI response body was empty." } as LlmProviderEvent;
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    const toolCalls: OpenAiToolCallAccumulator[] = [];

    const processPayload = (payload: string): LlmProviderEvent[] => {
      const events: LlmProviderEvent[] = [];
      if (payload === "[DONE]") {
        return events;
      }

      const parsed = JSON.parse(payload);
      const choice = parsed?.choices?.[0];
      const delta = choice?.delta;

      if (typeof delta?.content === "string" && delta.content.length > 0) {
        fullText += delta.content;
        events.push({ type: "text:delta", text: delta.content });
      }

      if (Array.isArray(delta?.tool_calls)) {
        for (const toolDelta of delta.tool_calls) {
          const index = Number(toolDelta.index ?? 0);
          if (!toolCalls[index]) {
            toolCalls[index] = { arguments: "" };
          }

          if (typeof toolDelta.id === "string") {
            toolCalls[index].id = toolDelta.id;
          }

          if (typeof toolDelta.function?.name === "string") {
            toolCalls[index].name = toolDelta.function.name;
          }

          if (typeof toolDelta.function?.arguments === "string") {
            toolCalls[index].arguments += toolDelta.function.arguments;
          }
        }
      }
      return events;
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const packets = buffer.split("\n\n");
      buffer = packets.pop() || "";

      for (const packet of packets) {
        for (const line of packet.split("\n")) {
          if (!line.startsWith("data:")) {
            continue;
          }
          const payload = line.slice(5).trim();
          if (!payload) {
            continue;
          }
          try {
            for (const providerEvent of processPayload(payload)) {
              yield providerEvent;
            }
          } catch (error) {
            yield {
              type: "error",
              error: error instanceof Error ? error.message : String(error)
            } as LlmProviderEvent;
          }
        }
      }
    }

    if (buffer.trim()) {
      for (const line of buffer.split("\n")) {
        if (!line.startsWith("data:")) {
          continue;
        }
        const payload = line.slice(5).trim();
        if (!payload) {
          continue;
        }
        try {
          for (const providerEvent of processPayload(payload)) {
            yield providerEvent;
          }
        } catch (error) {
          yield {
            type: "error",
            error: error instanceof Error ? error.message : String(error)
          } as LlmProviderEvent;
        }
      }
    }

    for (const call of toolCalls) {
      if (!call?.name) {
        continue;
      }
      let parsedInput: any = call.arguments;
      try {
        parsedInput = call.arguments ? JSON.parse(call.arguments) : {};
      } catch {
        // Keep raw input if it isn't valid JSON.
      }
      yield {
        type: "tool:call",
        callId: call.id || `call_${Math.random().toString(36).slice(2)}`,
        name: call.name,
        input: parsedInput
      } as LlmProviderEvent;
    }

    if (fullText.length > 0) {
      yield { type: "text:done", text: fullText } as LlmProviderEvent;
    }

    yield { type: "done" } as LlmProviderEvent;
  }
};

// Define some example actions
const weatherAction = defineAction({
  name: "get_weather",
  description: "Get the current weather for a location",
  parameters: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  },
  run: ({ input }) => {
    return { temperature: 22, condition: "Sunny", location: input.location };
  }
});

// Create the agent
const myAgent = agent({
  name: "Assistant",
  description: "A helpful assistant with weather capabilities",
  instructions: "You are a helpful assistant. Use tools when necessary."
})
  .use(actions({ actions: [weatherAction] }))
  .use(inspector({ url: "http://localhost:7777" }))
  .use(llm({ provider: openAiProvider }));

const sessionMessages = new Map<string, LlmMessage[]>();

app.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;
  const resolvedSessionId = typeof sessionId === "string" && sessionId.trim() ? sessionId.trim() : undefined;
  const activeSessionId = resolvedSessionId || "default";

  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "message must be a non-empty string" });
    return;
  }

  const history = sessionMessages.get(activeSessionId) || [];
  const nextMessages: LlmMessage[] = [...history, { role: "user", content: message }];
  sessionMessages.set(activeSessionId, nextMessages);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let assistantText = "";

  try {
    for await (const event of myAgent.run(message, {
      state: {
        sessionId: activeSessionId,
        messages: nextMessages
      }
    })) {
      if (event.type === "llm:text:delta") {
        const token = typeof event.data === "string" ? event.data : event.data?.text;
        if (typeof token === "string") {
          assistantText += token;
        }
      } else if (event.type === "llm:text") {
        const finalText = typeof event.data === "string" ? event.data : event.data?.text;
        if (typeof finalText === "string" && finalText.length > assistantText.length) {
          assistantText = finalText;
        }
      }

      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    if (assistantText.trim()) {
      sessionMessages.set(activeSessionId, [
        ...nextMessages,
        { role: "assistant", content: assistantText }
      ]);
    } else {
      sessionMessages.set(activeSessionId, nextMessages);
    }
  } catch (error) {
    console.error("Agent execution failed:", error);
    res.write(`data: ${JSON.stringify({ type: "error", data: { message: "Something went wrong" } })}\n\n`);
  } finally {
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});
