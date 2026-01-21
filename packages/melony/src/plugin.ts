import { Event, Plugin } from "./types";

/**
 * Helper to define a plugin.
 */
export const plugin = <TState = any, TEvent extends Event = Event>(
  config: Plugin<TState, TEvent>,
): Plugin<TState, TEvent> => config;
