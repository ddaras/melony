import { z } from "zod";
import { Action, Event } from "./types";

/**
 * Helper to define an action with full type inference.
 */
export const action = <
  TParams extends z.ZodSchema,
  TState = any,
  TEvent extends Event = Event,
>(
  config: Action<TParams, TState, TEvent>,
): Action<TParams, TState, TEvent> => config;
