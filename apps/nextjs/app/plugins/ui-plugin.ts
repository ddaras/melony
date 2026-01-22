import { MelonyPlugin } from "melony";
import { renderMenuCard } from "../uis/menu-card";
import { MenuItem } from "../data/menu";
import { FoodEvent, FoodState } from "../agents/types";
import { OrderResult, getOrderConfirmationMessage, renderOrderConfirmation } from "../uis/order-confirmation";

/**
 * UI Plugin
 * Automatically renders UI components based on action results.
 */
export const uiPlugin: MelonyPlugin<FoodState, FoodEvent> = (builder) => {
  builder.on("action:after", async function* (event) {
    if (event.data.action === "getMenu") {
      const { menu: menuItems } = event.data.result as { menu: MenuItem[] };

      yield {
        type: "ui",
        data: renderMenuCard(menuItems),
      } as FoodEvent;
    }

    if (event.data.action === "placeOrder") {
      const result = event.data.result as OrderResult;

      yield {
        type: "text-delta",
        data: { delta: getOrderConfirmationMessage(result) },
      } as FoodEvent;

      yield {
        type: "ui",
        data: renderOrderConfirmation(result),
      } as FoodEvent;
    }
  });
};
