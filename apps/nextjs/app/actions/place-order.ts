import { MENU } from "../data/menu";
import {
  getOrderConfirmationMessage,
  renderOrderConfirmation,
  OrderResult,
} from "../uis/order-confirmation";
import { FoodEvent } from "../agents/types";

type PlaceOrderParams = {
  itemId: string;
  quantity: number;
};

export const placeOrderAction = async function* ({
  itemId,
  quantity,
}: PlaceOrderParams) {
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
  } as FoodEvent;

  yield {
    type: "ui",
    data: renderOrderConfirmation(result),
  } as FoodEvent;

  return result;
};
