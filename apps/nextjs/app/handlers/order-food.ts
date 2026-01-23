import { RuntimeContext } from "melony";
import { FoodEvent, FoodState } from "../agents/types";

export const orderFoodHandler = async function* (
  event: FoodEvent,
  context: RuntimeContext<FoodState, FoodEvent>
) {
  if (event.type !== "order-food") return;

  yield {
    type: "text-delta",
    data: { delta: `Ordering food for ${event.data.itemId}...` },
  } as FoodEvent;

  // Execute the actual action instead of mimicking it
  // This will now automatically include the UI rendering logic
  yield* context.runtime.execute("placeOrder", {
    itemId: event.data.itemId,
    quantity: 1,
  });
};
