// ============================================
// Events (Generic & Headless)
// ============================================

import { Runtime } from "./runtime";

/**
 * The core Event structure.
 * Fully unopinionated - just type, data, and optional metadata.
 */
export type Event<TData = any> = {
  type: string;
  data: TData;
};

/**
 * Built-in error event emitted by the runtime.
 */
export interface ErrorEvent extends Event<{
  message: string;
  stack?: string;
}> {
  type: "error";
}

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
 * Event handler function for processing events.
 * Can return events to emit or undefined to continue processing.
 */
export type EventHandler<TState = any, TEvent extends Event = Event> = (
  event: TEvent,
  context?: RuntimeContext<TState, TEvent>
) => AsyncGenerator<TEvent, void, unknown> | void;

export interface Config<TState = any, TEvent extends Event = Event> {
  eventHandlers: Map<string, EventHandler<TState, TEvent>[]>;
}
