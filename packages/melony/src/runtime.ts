import {
  Action,
  Event,
  RuntimeContext,
  Config,
  EventHandler,
} from "./types";
import { generateId } from "./utils/generate-id";

/**
 * Helper to check if a value is a Melony Event.
 */
function isEvent(val: any): val is Event {
  return val && typeof val === "object" && typeof val.type === "string";
}

/**
 * The Melony Runtime.
 * Fully unopinionated - executes a single action per run.
 * Chaining/looping is left to userland.
 */
export class Runtime<TState = any, TEvent extends Event = Event> {
  public readonly config: Config<TState, TEvent>;
  private queue: TEvent[] = [];
  private isEmitting = false;

  constructor(config: Config<TState, TEvent>) {
    this.config = config;
  }

  /**
   * Run an action by name with given params.
   * This is the primary way to execute actions.
   */
  public async *execute(
    actionName: string,
    params: any,
    options?: { state?: TState; runId?: string },
  ): AsyncGenerator<TEvent> {
    const runId = options?.runId ?? generateId();

    const context: RuntimeContext<TState, TEvent> = {
      state: (options?.state ?? {}) as TState,
      runtime: this,
      runId,
      actions: this.config.actions,
      suspend: (event?: TEvent) => {
        throw event || { type: "run-suspended", data: {} };
      },
    };

    const action = this.config.actions[actionName];
    if (!action) {
      yield* this.emit(
        {
          type: "error",
          data: { message: `Action "${actionName}" not found` },
        } as TEvent,
        context,
      );
      return;
    }

    try {
      // Emit action:before event
      yield* this.emit(
        {
          type: "action:before",
          data: { action: actionName, params },
        } as TEvent,
        context,
      );

      // Execute the action - users handle lifecycle events explicitly
      const generator = action.execute(params, context);
      let result: any = undefined;

      while (true) {
        const { value, done } = await generator.next();
        if (done) {
          result = value; // Capture the return value
          break;
        }
        yield* this.emit(value as TEvent, context);
      }

      // Emit action:after event
      yield* this.emit(
        {
          type: "action:after",
          data: { action: actionName, result },
        } as TEvent,
        context,
      );
    } catch (error) {
      let eventToEmit: TEvent | undefined;

      if (isEvent(error)) {
        eventToEmit = error as TEvent;
      } else {
        eventToEmit = {
          type: "error",
          data: {
            action: actionName,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
        } as TEvent;
      }

      if (eventToEmit) {
        yield* this.emit(eventToEmit, context);
      }
    }
  }

  /**
   * Process an incoming event through the runtime.
   * All event processing is handled by user-defined event handlers.
   */
  public async *run(event: TEvent): AsyncGenerator<TEvent> {
    const runId = event.meta?.runId ?? generateId();

    const context: RuntimeContext<TState, TEvent> = {
      state: (event.meta?.state ?? {}) as TState,
      runtime: this,
      runId,
      actions: this.config.actions,
      suspend: (event?: TEvent) => {
        throw event || { type: "run-suspended", data: {} };
      },
    };

    try {
      // Process the incoming event through handlers
      yield* this.runEventHandlers(event, context);
    } catch (error) {
      let eventToEmit: TEvent | undefined;

      if (isEvent(error)) {
        eventToEmit = error as TEvent;
      } else {
        eventToEmit = {
          type: "error",
          data: {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
        } as TEvent;
      }

      if (eventToEmit) {
        yield* this.emit(eventToEmit, context);
      }
    }
  }


  /**
   * Run all event handlers that match the given event type.
   */
  private async *runEventHandlers(
    event: TEvent,
    context: RuntimeContext<TState, TEvent>,
  ): AsyncGenerator<TEvent> {
    const handlers = this.config.eventHandlers.get(event.type) || [];
    for (const handler of handlers) {
      const result = handler(event, context);
      if (result) {
        for await (const yieldedEvent of result) {
          yield yieldedEvent;
          // Recursively process yielded events through their handlers
          yield* this.runEventHandlers(yieldedEvent, context);
        }
      }
    }
  }

  /**
   * Internal helper to yield an event with metadata.
   * Handlers are invoked by runEventHandlers when events bubble up.
   */
  private async *emit(
    event: TEvent,
    context: RuntimeContext<TState, TEvent>,
  ): AsyncGenerator<TEvent> {
    this.queue.push(event);

    if (this.isEmitting) return;

    this.isEmitting = true;
    try {
      while (this.queue.length > 0) {
        const current = this.queue.shift()!;

        const finalEvent: TEvent = {
          ...current,
          meta: {
            ...current.meta,
            id: current.meta?.id ?? generateId(), 
            runtime: this,
            runId: context.runId,
            timestamp: current.meta?.timestamp ?? Date.now(),
            role: current.meta?.role ?? "assistant",
            state: context.state,
          },
        };

        yield finalEvent;
      }
    } finally {
      this.isEmitting = false;
    }
  }
}
