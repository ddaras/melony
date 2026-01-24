import { melony } from "melony";
import { aiSDKPlugin } from "@melony/plugin-ai-sdk";
import { persistencePlugin } from "@melony/plugin-persistence";
import { observabilityPlugin } from "@melony/plugin-observability";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { getMenuHandler } from "../handlers/get-menu";
import { placeOrderHandler } from "../handlers/place-order";
import { initAppHandler } from "../handlers/init";
import { FoodState, FoodEvent } from "./types";

export * from "./types";

const systemPrompt = "You are a helpful food ordering assistant. Use the tools provided to help the user with the menu and placing orders. When you call a tool, the corresponding event will be triggered and processed.";

/**
 * Food ordering agent
 * A demo agent that helps users browse a menu and place food orders
 */
export const foodAgent = melony<FoodState, FoodEvent>()
  .use(observabilityPlugin({
    log: (name, data) => console.log(`[FoodAgent:${name}]`, data),
  }))
  .use(persistencePlugin({
    adapter: {
      saveEvent: async (runId, event) => {
        // In a real app, save to Database (Prisma/Drizzle)
        console.log(`[Persistence] Saving event ${event.type} for run ${runId}`);
      },
      getHistory: async (runId) => {
        return []; // Load from DB
      },
    }
  }))
  .use(aiSDKPlugin({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    toolDefinitions: {
      'getMenu': {
        description: "Get the current food food menu",
        inputSchema: z.object({}),
      },
      'placeOrder': {
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
  }))
  .on("action:getMenu", getMenuHandler)
  .on("action:placeOrder", placeOrderHandler)
  .on("init", initAppHandler);
