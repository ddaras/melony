import { MENU } from "../data/menu";
import {
  getOrderConfirmationMessage,
  renderOrderConfirmation,
  OrderResult,
} from "../uis/order-confirmation";
import { FoodEvent, FoodState } from "../agents/types";
import { EventHandler } from "melony";

export const placeOrderHandler: EventHandler<FoodState, FoodEvent> = async function* (event) {
  if (event.type !== "action:placeOrder") return;

  const { itemId, quantity = 1 } = event.data as { itemId: string; quantity?: number };

  const item = MENU.find((m) => m.id === itemId);
  if (!item) throw new Error("Item not found");

  const total = item.price * quantity;

  const result: OrderResult = {
    success: true,
    orderId: Math.random().toString(36).substring(7).toUpperCase(),
    item: item.name,
    quantity,
    total: total.toFixed(2),
  };

  yield {
    type: "text-delta",
    data: { delta: getOrderConfirmationMessage(result) },
  };

  yield {
    type: "ui",
    data: renderOrderConfirmation(result),
  };

  yield {
    type: "action:result",
    data: {
      action: "placeOrder",
      result: result,
    },
  };
};
