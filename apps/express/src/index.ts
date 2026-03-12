import express from "express";
import { agent } from "@melony/agents";
import { llm, LlmMessage } from "@melony/llm";
import { createOpenAIProvider } from "@melony/llm-openai";
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

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const openAiProvider = createOpenAIProvider({
  apiKey: OPENAI_API_KEY,
  model: OPENAI_MODEL
});

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
        // Pass a copy to prevent plugins from accidentally mutating our session history
        messages: [...nextMessages]
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
      // Check if the assistant message was already added by a plugin or handler
      // If it was, we just save the final nextMessages as is
      const historyUpdate = [...nextMessages];
      const lastMessage = historyUpdate[historyUpdate.length - 1];
      
      if (!lastMessage || lastMessage.role !== "assistant" || lastMessage.content !== assistantText) {
        historyUpdate.push({ role: "assistant", content: assistantText });
      }
      
      sessionMessages.set(activeSessionId, historyUpdate);
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
