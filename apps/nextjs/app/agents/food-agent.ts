import { melony } from "melony";
import { getMenuAction } from "../actions/get-menu";
import { placeOrderAction } from "../actions/place-order";
import { orderFoodHandler } from "../handlers/order-food";
import { llmRouterPlugin } from "../plugins/llm-router-plugin";
import { uiPlugin } from "../plugins/ui-plugin";
import { FoodState, FoodEvent } from "./types";

export * from "./types";

/**
 * Food ordering agent
 * A demo agent that helps users browse a menu and place food orders
 */
export const foodAgent = melony<FoodState, FoodEvent>()
  .use(llmRouterPlugin)
  .use(uiPlugin)
  .action("getMenu", getMenuAction)
  .action("placeOrder", placeOrderAction)
  .on("order-food", orderFoodHandler);
