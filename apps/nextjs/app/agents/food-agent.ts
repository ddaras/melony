import { MelonyRuntime } from "melony";
import type { Event as MelonyEvent, UINode } from "melony";
import { getMenuAction } from "../actions/get-menu";
import { placeOrderAction } from "../actions/place-order";
import { llmRouterPlugin } from "../plugins/llm-router";
import { actionUiRendererPlugin } from "../plugins/action-ui-renderer";

/**
 * State type for the Food Agent
 */
export type FoodState = {
  // Add any state tracking here
};

/**
 * Event types for the Food Agent
 */
export type FoodEvent = MelonyEvent &
  (
    | { type: "text"; data: { content: string } }
    | { type: "text-delta"; data: { delta: string } }
    | { type: "ui"; data: UINode }
    | { type: "order-food"; data: { itemId: string } }
  );

/**
 * Menu item type
 */
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
};

/**
 * Food ordering agent
 * A demo agent that helps users browse a menu and place food orders
 */
export const foodAgent = new MelonyRuntime<FoodState, FoodEvent>({
  actions: {
    getMenu: getMenuAction,
    placeOrder: placeOrderAction,
  },
  plugins: [
    llmRouterPlugin(),
    actionUiRendererPlugin(),
  ],
  starterPrompts: [
    { label: "Show Menu", prompt: "Show me the menu" },
    { label: "I'm hungry", prompt: "I'm hungry, what can I eat?" },
  ],
});
