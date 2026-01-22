import { MelonyPlugin } from "melony";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { FoodEvent, FoodState } from "../agents/types";
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
 * LLM Router Plugin
 * Handles user text input and action results by routing them through an LLM.
 */
export const llmRouterPlugin: MelonyPlugin<FoodState, FoodEvent> = (builder) => {
  // Handle user text events
  builder.on("text", async function* (event) {
    if (event.meta?.role === "user") {
      const text = event.data?.content || "";
      yield* routeToLLM([{ role: "user", content: text }]);
    }
  });

  // Handle action results to decide next steps
  builder.on("action:after", async function* (event) {
    const { action, result } = event.data;

    const messages = [
      {
        role: "user" as const,
        content: `[System: The "${action}" action was executed. Result: ${JSON.stringify(result)}]\n\nBased on this result, decide if you need to take any follow-up actions or respond to the user.`,
      },
    ];

    yield* routeToLLM(messages);
  });
};
