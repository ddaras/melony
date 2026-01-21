 import { Action, ActionExecute, Event } from "./types";

/**
 * Create an action with just a name and handler.
 * Compatible with any agent - types are resolved automatically when added to an agent.
 */
export function action<TParams = any>(
  name: string,
  execute: ActionExecute<TParams, any, any>,
): Action<TParams, any, any>;
/**
 * Helper to define an action with full type inference (for advanced use cases).
 */
export function action<
  TParams = any,
  TState = any,
  TEvent extends Event = Event,
>(
  config: Action<TParams, TState, TEvent>,
): Action<TParams, TState, TEvent>;
export function action<
  TParams = any,
  TState = any,
  TEvent extends Event = Event,
>(
  ...args: [Action<TParams, TState, TEvent>] | [string, ActionExecute<TParams, any, any>]
): Action<TParams, TState, TEvent> | Action<TParams, any, any> {
  if (typeof args[0] === "string") {
    const [name, execute] = args as [string, ActionExecute<TParams, any, any>];
    return { name, execute };
  }

  if (typeof args[0] === "object" && args[0] !== null && 'name' in args[0] && 'execute' in args[0]) {
    return args[0] as Action<TParams, TState, TEvent>;
  }

  throw new Error("Invalid action parameters");
}
