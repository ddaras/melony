import express from "express";
import { agent } from "@melony/agents";
import { llm, LlmProviderEvent, LlmProvider } from "@melony/llm";
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

// Mock LLM Provider
const mockProvider: LlmProvider = {
  name: "mock-provider",
  async *generate(args) {
    yield { type: "text:delta", text: "Hello! " } as LlmProviderEvent;
    yield { type: "text:delta", text: "I'm " } as LlmProviderEvent;
    yield { type: "text:delta", text: "a Melony agent. " } as LlmProviderEvent;
    yield { type: "text:delta", text: "How can I help you today?" } as LlmProviderEvent;
    yield { type: "text:done", text: "Hello! I'm a Melony agent. How can I help you today?" } as LlmProviderEvent;
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
  .use(llm({ provider: mockProvider }));

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    for await (const event of myAgent.run(message)) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
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
