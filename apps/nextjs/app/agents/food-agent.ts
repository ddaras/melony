import { melony } from "melony";
import type { Event as MelonyEvent, } from "melony";
import { getMenuAction } from "../actions/get-menu";
import { placeOrderAction } from "../actions/place-order";
import { llmRouter, llmRouterAfterAction } from "../handlers/llm-router";
import { renderUiAfterAction } from "../handlers/render-ui-after-action";
import { orderFoodHandler } from "../handlers/order-food";

/**
 * State type for the Food Agent
 */
export type FoodState = {
  // Add any state tracking here
};

/**
 * Event types for the Food Agent
 */

export type TextEvent = MelonyEvent & { type: "text"; data: { content: string } };
export type TextDeltaEvent = MelonyEvent & { type: "text-delta"; data: { delta: string } };
export type UINodeEvent = MelonyEvent & { type: "ui"; data: { type: string; props: any; children: any[] } };
export type OrderFoodEvent = MelonyEvent & { type: "order-food"; data: { itemId: string } };
export type ActionBeforeEvent = MelonyEvent & { type: "action:before"; data: { action: string; params: any } };
export type ActionAfterEvent = MelonyEvent & { type: "action:after"; data: { action: string; result: any } };

export type FoodEvent = TextEvent | TextDeltaEvent | UINodeEvent | OrderFoodEvent | ActionBeforeEvent | ActionAfterEvent;

/**
 * Food ordering agent
 * A demo agent that helps users browse a menu and place food orders
 */
export const foodAgent = melony<FoodState, FoodEvent>()
  .action("getMenu", getMenuAction)
  .action("placeOrder", placeOrderAction)
  .on("text", llmRouter)
  .on("action:after", renderUiAfterAction)
  .on("action:after", llmRouterAfterAction)
  .on("order-food", orderFoodHandler)