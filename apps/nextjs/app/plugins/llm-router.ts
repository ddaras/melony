import { plugin } from "melony";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { FoodState, FoodEvent } from "../agents/food-agent";

/**
 * Plugin that handles LLM interaction and routes user messages to appropriate actions.
 * Streams text responses and determines tool calls based on user input.
 */
export const llmRouterPlugin = () =>
  plugin<FoodState, FoodEvent>({
    name: "llm-router",

    onBeforeRun: async function* ({ event }) {
      if (event.meta?.role === "user" && event.type === "text") {
        const text = event.data?.content || "";

        const result = streamText({
          model: openai("gpt-4o-mini"),
          system:
            "You are a helpful food ordering assistant. Use the tools provided to help the user with the menu and placing orders.",
          messages: [{ role: "user", content: text }],
          tools: {
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
          },
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
          return {
            action: call.toolName,
            params: call.input,
          };
        }
      }
    },
  });
