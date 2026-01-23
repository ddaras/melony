import { MelonyPlugin } from "melony";
import { FoodEvent, FoodState } from "../agents/types";

/**
 * UI Plugin
 * Automatically renders UI components based on action results.
 * 
 * Note: Most rendering logic has been moved directly into actions
 * to provide more immediate feedback.
 */
export const uiPlugin: MelonyPlugin<FoodState, FoodEvent> = (builder) => {
  // Add any global UI event handlers here if needed
};
