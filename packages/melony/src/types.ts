// ============================================
// Events (Generic & Headless)
// ============================================

import { Runtime } from "./runtime";

export type Role = "user" | "assistant" | "system";

/**
 * System-managed metadata for an event.
 */
export interface EventMeta<TState = any> {
  id: string;
  runId: string;
  timestamp: number;
  role: Role;
  state: TState;
  [key: string]: any;
}

/**
 * The core Event structure.
 * Fully unopinionated - just type, data, and optional metadata.
 */
export type Event<TData = any> = {
  type: string;
  data: TData;
  meta?: EventMeta;
};

/**
 * Built-in action lifecycle events emitted by the runtime.
 */
export interface ActionBeforeEvent extends Event<{
  action: string;
  params: any;
}> {
  type: "action:before";
}

export interface ActionAfterEvent extends Event<{
  action: string;
  result: any;
}> {
  type: "action:after";
}

/**
 * Built-in call-action event for triggering action execution.
 */
export interface CallActionEvent extends Event<{
  action: string;
  params: unknown;
}> {
  type: "call-action";
}

/**
 * Built-in error event emitted by the runtime.
 */
export interface ErrorEvent extends Event<{
  message: string;
  action?: string;
  stack?: string;
}> {
  type: "error";
}

// ============================================
// Runtime & Hooks
// ============================================

export type ActionExecute<
  TParams = any,
  TState = any,
  TEvent extends Event = Event,
> = (
  params: TParams,
  context: RuntimeContext<TState, TEvent>,
) => AsyncGenerator<TEvent, any, unknown>;

export interface Action<
  TParams = any,
  TState = any,
  TEvent extends Event = Event,
> {
  name: string;
  execute: ActionExecute<TParams, TState, TEvent>;
}

export interface RuntimeContext<TState = any, TEvent extends Event = Event> {
  state: TState;
  runId: string;
  actions: Record<string, Action<any, TState, TEvent>>;
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
  context: RuntimeContext<TState, TEvent>
) => AsyncGenerator<TEvent, void, unknown> | void;

export interface Config<TState = any, TEvent extends Event = Event> {
  actions: Record<string, Action<any, TState, TEvent>>;
  eventHandlers: Map<string, EventHandler<TState, TEvent>[]>;
}
