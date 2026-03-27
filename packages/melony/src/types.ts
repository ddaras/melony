// ============================================
// Runtime & Hooks
// ============================================
import { Runtime } from "./runtime";

/**
 * Options for executing a Melony run.
 */
export interface RunOptions<TState = any> {
  state?: TState;
  runId?: string;
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
  /**
   * The initial state for the runtime.
   * Can be an object or a factory function (sync or async).
   */
  initialState?: TState | (() => TState | Promise<TState>);
}
