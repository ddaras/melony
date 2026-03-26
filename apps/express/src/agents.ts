import { agent } from "@melony/agents";
import { llm } from "@melony/llm";
import { actions } from "@melony/actions";
import { planning } from "@melony/planning";
import { inspector } from "@melony/inspector";
import { sequential } from "@melony/workflows";
import { geminiProvider } from "./config.js";
import { weatherAction } from "./actions.js";

/**
 * Default chat agent
 * @name defaultChatAgent
 * @description A helpful assistant with weather capabilities
 * @instructions You are a helpful assistant. Use tools when necessary.
 * @uses actions
 * @uses inspector
 * @uses llm
 * @uses planning
 */
export const defaultChatAgent = agent({
  name: "Assistant",
  description: "A helpful assistant with weather capabilities",
  instructions: "You are a helpful assistant. Use tools when necessary."
})
  .use(actions({ actions: [weatherAction] }))
  .use(inspector({ url: "http://localhost:7123" }))
  .use(llm({ provider: geminiProvider }))
  .use(planning({ provider: geminiProvider }));

/**
 * Classifier agent
 * @name classifierAgent
 * @description Classifies user requests before answering.
 * @instructions You classify the user's request for a second agent.
 * @uses llm
 */
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

/**
 * Answer agent
 * @name answerAgent
 * @description Produces the final response for the user.
 * @instructions You are the final assistant. Use prior context in state.messages and provide a clear, helpful final answer.
 * @uses actions
 * @uses llm
 * @uses planning
 */
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

        if (input && (!lastMessage || lastMessage.role !== "user")) {
          baseMessages.push({ role: "user", content: input });
        }

        return baseMessages;
      }
    })
  )
  .use(planning({ provider: geminiProvider }));

/**
 * Sequential chat agent
 * @name sequentialChatAgent
 * @description Runs request classification before final response generation.
 * @instructions Run the configured sequential workflow and emit all step events.
 * @uses inspector
 * @uses sequential
 */
export const sequentialChatAgent = agent({
  name: "Sequential Assistant",
  description: "Runs request classification before final response generation.",
  instructions: "Run the configured sequential workflow and emit all step events."
})
  .use(inspector({ url: "http://localhost:7123" }))
  .use(sequential([classifierAgent, answerAgent]));
