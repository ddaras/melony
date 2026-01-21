import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { ActionAfterEvent, FoodEvent, FoodState, TextEvent } from "../agents/food-agent";
import { RuntimeContext } from "melony";
import { z } from "zod";

const tools = {
  getMenu: {
    description: "Get the current food menu",
    inputSchema: z.object({}),
  },
  placeOrder: {
    description: "Place a food order",
    inputSchema: z.object({
      itemId: z.string().describe("The ID of the item to order"),
      quantity: z
        .number()
        .default(1)
        .describe("The quantity to order"),
    }),
  },
};

const systemPrompt = "You are a helpful food ordering assistant. Use the tools provided to help the user with the menu and placing orders. After an action completes, analyze the result and decide if you need to take additional actions or respond to the user.";

async function* routeToLLM(messages: any[]): AsyncGenerator<FoodEvent, void, unknown> {
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages,
    tools,
  });

  for await (const delta of result.textStream) {
    yield {
      type: "text-delta",
      data: { delta },
    } as FoodEvent;
  }

  const toolCalls = await result.toolCalls;
  if (toolCalls && toolCalls.length > 0) {
    const call = toolCalls[0];

    yield {
      type: "call-action",
      data: {
        action: call.toolName,
        params: call.input,
      },
    } as FoodEvent;
  }
}

/**
 * Handles user text events - routes to LLM for initial processing
 */
export const llmRouter = async function* (event: TextEvent, context: RuntimeContext<FoodState, FoodEvent>) {
  if (event.meta?.role === "user") {
    const text = event.data?.content || "";

    yield* routeToLLM([{ role: "user", content: text }]);
  }
};

/**
 * Handles action:after events - routes action results to LLM to decide next steps
 */
export const llmRouterAfterAction = async function* (event: ActionAfterEvent, context: RuntimeContext<FoodState, FoodEvent>) {
  const { action, result } = event.data;

  // Send action result as context for LLM to decide next steps
  const messages = [
    {
      role: "user" as const,
      content: `[System: The "${action}" action was executed. Result: ${JSON.stringify(result)}]\n\nBased on this result, decide if you need to take any follow-up actions or respond to the user.`,
    },
  ];

  yield* routeToLLM(messages);
};