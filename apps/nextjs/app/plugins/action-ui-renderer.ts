import { plugin } from "melony";
import type { FoodState, FoodEvent, MenuItem } from "../agents/food-agent";
import { renderMenuCard } from "../uis/menu-card";
import {
  renderOrderConfirmation,
  getOrderConfirmationMessage,
  type OrderResult,
} from "../uis/order-confirmation";

/**
 * Plugin that renders UI components after action execution.
 * Handles visual feedback for menu display and order confirmations.
 */
export const actionUiRendererPlugin = () =>
  plugin<FoodState, FoodEvent>({
    name: "action-ui-renderer",

    onAfterAction: async function* ({ action, data }) {
      if (action.name === "getMenu") {
        const { menu: menuItems } = data as { menu: MenuItem[] };

        yield {
          type: "ui",
          data: renderMenuCard(menuItems),
        } as FoodEvent;
      }

      if (action.name === "placeOrder") {
        const result = data as OrderResult;

        yield {
          type: "text-delta",
          data: { delta: getOrderConfirmationMessage(result) },
        } as FoodEvent;

        yield {
          type: "ui",
          data: renderOrderConfirmation(result),
        } as FoodEvent;
      }
    },
  });
