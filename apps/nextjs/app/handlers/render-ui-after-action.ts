import { renderMenuCard } from "../uis/menu-card";
import { MenuItem } from "../data/menu";
import { FoodEvent, FoodState } from "../agents/food-agent";
import { OrderResult } from "../uis/order-confirmation";
import { getOrderConfirmationMessage } from "../uis/order-confirmation";
import { renderOrderConfirmation } from "../uis/order-confirmation";
import { RuntimeContext } from "melony";

export const renderUiAfterAction = async function* (event: FoodEvent, context: RuntimeContext<FoodState, FoodEvent>) {

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
}