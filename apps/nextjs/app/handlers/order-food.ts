import { RuntimeContext } from "melony";
import { FoodEvent, FoodState } from "../agents/types";

export const orderFoodHandler = async function* (event: FoodEvent, context: RuntimeContext<FoodState, FoodEvent>) {
  yield {
    type: "text-delta",
    data: { delta: `Ordering food for ${event.data.itemId}...` },
  } as FoodEvent;

  yield {
    type: "action:after",
    data: { action: "placeOrder", result: { success: true, orderId: "123", item: "Food", quantity: 1, total: "10.00" } },
  } as FoodEvent;
}