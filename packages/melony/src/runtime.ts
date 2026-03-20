import {
  Event,
  RuntimeContext,
  Config,
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
 * Fully unopinionated - processes events through handlers.
 */
export class Runtime<TState = any, TEvent extends Event = Event> {
  public readonly config: Config<TState, TEvent>;

  constructor(config: Config<TState, TEvent>) {
    this.config = config;
  }

  /**
   * Process an incoming event through the runtime.
   * All event processing is handled by user-defined event handlers.
   */
  public async *run(
    event: TEvent, 
    options?: { state?: TState; runId?: string }
  ): AsyncGenerator<TEvent> {
    const runId = options?.runId ?? generateId();
    
    const context: RuntimeContext<TState, TEvent> = {
      state: (options?.state ?? {}) as TState,
      runtime: this,
      runId,
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
    let currentEvent = event;

    // 1. Run global interceptors first
    const globalInterceptors = this.config.interceptors.get("*") || [];
    for (const interceptor of globalInterceptors) {
      const result = await interceptor(currentEvent, context);
      if (result && typeof result === "object" && "type" in result) {
        currentEvent = result as TEvent;
      }
    }

    // 2. Run specific interceptors for the (possibly new) event type
    // If currentEvent.type is "*", it's already been handled by the global interceptors
    if (currentEvent.type !== "*") {
      const specificInterceptors = this.config.interceptors.get(currentEvent.type) || [];
      for (const interceptor of specificInterceptors) {
        const result = await interceptor(currentEvent, context);
        if (result && typeof result === "object" && "type" in result) {
          currentEvent = result as TEvent;
        }
      }
    }

    const handlers = [
      ...(this.config.eventHandlers.get("*") || []),
      ...(this.config.eventHandlers.get(currentEvent.type) || []),
    ];
    
    // First emit the event itself
    yield* this.emit(currentEvent, context);

    for (const handler of handlers) {
      const result = handler(currentEvent, context);
      if (result) {
        for await (const yieldedEvent of result) {
          // Recursively process yielded events through their handlers
          yield* this.runEventHandlers(yieldedEvent, context);
        }
      }
    }
  }

  /**
   * Internal helper to yield an event with metadata.
   */
  private async *emit(
    event: TEvent,
    context?: RuntimeContext<TState, TEvent>,
  ): AsyncGenerator<TEvent> {
    yield event;
  }
}
