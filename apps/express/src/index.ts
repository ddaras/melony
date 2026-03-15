import express from "express";
import { agent, AgentEvents, AgentPlugin } from "@melony/agents";
import { llm, LlmMessage } from "@melony/llm";
import { createGeminiProvider } from "@melony/gemini";
import { actions, defineAction } from "@melony/actions";
import { planning, PlanningState, PlannerStrategy } from "@melony/planning";
import { inspector } from "@melony/inspector";
import { loop, parallel, sequential } from "@melony/workflows";
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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const geminiProvider = createGeminiProvider({
  apiKey: GEMINI_API_KEY,
  model: GEMINI_MODEL
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
  .use(llm({ provider: geminiProvider }))
  .use(planning({ provider: geminiProvider }));

const classifierAgent = agent({
  name: "Classifier",
  description: "Classifies user requests before answering.",
  instructions: `You classify the user's request for a second agent.
Respond as concise JSON with keys:
- intent
- complexity
- required_tools
Do not include markdown.`
}).use(llm({ provider: geminiProvider }));

const answerAgent = agent({
  name: "Answer",
  description: "Produces the final response for the user.",
  instructions:
    "You are the final assistant. Use prior context in state.messages and provide a clear, helpful final answer."
})
  .use(actions({ actions: [weatherAction] }))
  .use(
    llm({
      provider: geminiProvider,
      messageSelector: (ctx) => {
        const state = ctx.state as any;
        const baseMessages = Array.isArray(state.messages) ? [...state.messages] : [];
        const input = typeof state.input === "string" ? state.input.trim() : "";
        const lastMessage = baseMessages[baseMessages.length - 1];

        // Ensure the final step always has a current user turn to respond to.
        if (input && (!lastMessage || lastMessage.role !== "user")) {
          baseMessages.push({ role: "user", content: input });
        }

        return baseMessages;
      }
    })
  )
  .use(planning({ provider: geminiProvider }));

const sequentialWorkflowAgent = agent({
  name: "Sequential Assistant",
  description: "Runs request classification before final response generation.",
  instructions: "Run the configured sequential workflow and emit all step events."
})
  .use(inspector({ url: "http://localhost:7777" }))
  .use(sequential([classifierAgent, answerAgent]));

const sessionMessages = new Map<string, LlmMessage[]>();

const resolveSessionId = (rawSessionId: unknown): string => {
  const resolvedSessionId =
    typeof rawSessionId === "string" && rawSessionId.trim() ? rawSessionId.trim() : undefined;
  return resolvedSessionId || "default";
};

const extractTextEventPayload = (event: any): { text: string; type: string } | null => {
  if (!event || typeof event !== "object") {
    return null;
  }

  if (event.type === "workflow:step:event") {
    return extractTextEventPayload(event.data?.event);
  }

  if (event.type !== "llm:text:delta" && event.type !== "llm:text") {
    return null;
  }

  const text = typeof event.data === "string" ? event.data : event.data?.text;
  if (typeof text !== "string") {
    return null;
  }

  return { text, type: event.type };
};

const streamAgentRun = async ({
  runAgent,
  message,
  activeSessionId,
  response
}: {
  runAgent: typeof myAgent;
  message: string;
  activeSessionId: string;
  response: express.Response;
}) => {
  const history = sessionMessages.get(activeSessionId) || [];
  const nextMessages: LlmMessage[] = [...history, { role: "user", content: message }];
  sessionMessages.set(activeSessionId, nextMessages);

  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Connection", "keep-alive");

  let assistantText = "";

  try {
    for await (const event of runAgent.run(message, {
      state: {
        sessionId: activeSessionId,
        input: message,
        // Pass a copy to prevent plugins from accidentally mutating our session history
        messages: [...nextMessages]
      }
    })) {
      if (event.type === "workflow:step:start") {
        // In sequential workflows, keep only the current step's visible text.
        assistantText = "";
      } else {
        const textPayload = extractTextEventPayload(event);
        if (textPayload) {
          if (textPayload.type === "llm:text:delta") {
            assistantText += textPayload.text;
          } else if (textPayload.type === "llm:text" && textPayload.text.length > assistantText.length) {
            assistantText = textPayload.text;
          }
        }
      }

      response.write(`data: ${JSON.stringify(event)}\n\n`);
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
    response.write(
      `data: ${JSON.stringify({ type: "error", data: { message: "Something went wrong" } })}\n\n`
    );
  } finally {
    response.end();
  }
};

app.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;
  const activeSessionId = resolveSessionId(sessionId);

  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "message must be a non-empty string" });
    return;
  }

  await streamAgentRun({
    runAgent: myAgent,
    message,
    activeSessionId,
    response: res
  });
});

app.post("/chat/sequential", async (req, res) => {
  const { message, sessionId } = req.body;
  const activeSessionId = resolveSessionId(sessionId);

  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "message must be a non-empty string" });
    return;
  }

  await streamAgentRun({
    runAgent: sequentialWorkflowAgent,
    message,
    activeSessionId,
    response: res
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});
