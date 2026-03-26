// ============================================
// Runtime & Hooks
// ============================================

import { Runtime } from "./runtime";

/**
 * Reserved system event types for Melony.
 * Using the melony: prefix ensures no collision with user events.
 */
export const SystemEvents = {
  /**
   * Emitted automatically by the builder to track the lifecycle of a run.
   */
  RunStatus: "run:status",
} as const;

/**
 * Standard statuses for a Melony run.
 */
export type RunStatus = "pending" | "running" | "completed" | "failed";

/**
 * Options for executing a Melony run.
 */
export interface RunOptions<TState = any> {
  state?: TState;
  runId?: string;
  /**
   * If true, do not emit system lifecycle events (run:status).
   * Useful for internal/sub-runs or cleanup logic.
   */
  silent?: boolean;
}

export interface RuntimeContext<TState = any, TEvent = any> {
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
export type EventInterceptor<TState = any, TEvent = any> = (
  event: TEvent,
  context: RuntimeContext<TState, TEvent>
) => Promise<TEvent | void> | TEvent | void;

/**
 * Event handler function for processing events.
 * Can return events to emit or undefined to continue processing.
 */
export type EventHandler<TState = any, TEvent = any> = (
  event: TEvent,
  context: RuntimeContext<TState, TEvent>
) => AsyncGenerator<TEvent, void, unknown> | void;

/**
 * Configuration for the Melony runtime.
 */
export interface Config<TState = any, TEvent = any> {
  handlers: Map<string, EventHandler<TState, TEvent>[]>;
  interceptors: Map<string, EventInterceptor<TState, TEvent>[]>;
  /**
   * The key in the event object that defines its type.
   * Defaults to "type".
   */
  eventKey?: string;
}
