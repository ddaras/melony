import type { Event as MelonyEvent } from "melony";
import type { UIEvent } from "@melony/ui-kit";

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
export type UINodeEvent = UIEvent;
export type OrderFoodEvent = MelonyEvent & { type: "order-food"; data: { itemId: string } };
export type ActionBeforeEvent = MelonyEvent & { type: "action:before"; data: { action: string; params: any } };
export type ActionAfterEvent = MelonyEvent & { type: "action:after"; data: { action: string; result: any } };

export type FoodEvent = 
  | TextEvent 
  | TextDeltaEvent 
  | UINodeEvent 
  | OrderFoodEvent 
  | ActionBeforeEvent 
  | ActionAfterEvent;
