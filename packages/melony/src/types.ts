// ============================================
// Events (Generic & Headless)
// ============================================

import { Runtime } from "./runtime";

/**
 * The core Event structure.
 * Truly unopinionated - only 'type' is strictly required for dispatching.
 */
export type Event = {
  /** The type of the event (required for runtime dispatching) */
  type: string;
  /** Catch-all for any other custom fields */
  [key: string]: any;
};

// ============================================
// Runtime & Hooks
// ============================================

export interface RuntimeContext<TState = any, TEvent extends Event = Event> {
  state: TState;
  runId: string;
  runtime: Runtime<TState, TEvent>;

  /**
   * Immediately interrupts the runtime execution.
   * If an event is provided, it will be emitted before the runtime stops.
   */
  suspend: (event?: TEvent) => never;
}

/**
 * Interceptors run before any event handlers.
 * They can modify the event or call context.suspend() to stop execution.
 */
export type Interceptor<TState = any, TEvent extends Event = Event> = (
  event: TEvent,
  context: RuntimeContext<TState, TEvent>
) => Promise<TEvent | void> | TEvent | void;

/**
 * Event handler function for processing events.
 * Can return events to emit or undefined to continue processing.
 */
export type EventHandler<TState = any, TEvent extends Event = Event> = (
  event: TEvent,
  context: RuntimeContext<TState, TEvent>
) => AsyncGenerator<TEvent, void, unknown> | void;

export interface Config<TState = any, TEvent extends Event = Event> {
  eventHandlers: Map<string, EventHandler<TState, TEvent>[]>;
  interceptors: Map<string, Interceptor<TState, TEvent>[]>;
}
