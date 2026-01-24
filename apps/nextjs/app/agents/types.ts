import type { Event as MelonyEvent } from "melony";
import type { UIEvent, UINode } from "@melony/ui-kit";

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
export type AssistantTextDeltaEvent = MelonyEvent & { type: "assistant:text-delta"; data: { delta: string } };
export type UINodeEvent = MelonyEvent & { type: "ui"; data: UINode };
export type GetMenuEvent = MelonyEvent & { type: "action:getMenu"; data: Record<string, never> };
export type PlaceOrderEvent = MelonyEvent & { type: "action:placeOrder"; data: { itemId: string; quantity?: number } };
export type ActionAfterEvent = MelonyEvent & { type: "action:after"; data: { action: string; result: any } };


export type FoodEvent =
  | TextEvent
  | TextDeltaEvent
  | AssistantTextDeltaEvent
  | UINodeEvent
  | GetMenuEvent
  | PlaceOrderEvent
  | ActionAfterEvent;
