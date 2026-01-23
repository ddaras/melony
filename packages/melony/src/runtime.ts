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
  private queue: TEvent[] = [];
  private isEmitting = false;

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
    context?: RuntimeContext<TState, TEvent>,
  ): AsyncGenerator<TEvent> {
    const handlers = [
      ...(this.config.eventHandlers.get(event.type) || []),
      ...(this.config.eventHandlers.get("*") || []),
    ];
    
    // First emit the event itself
    yield* this.emit(event, context);

    for (const handler of handlers) {
      const result = handler(event, context);
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
    this.queue.push(event);

    if (this.isEmitting) return;

    this.isEmitting = true;
    try {
      while (this.queue.length > 0) {
        const current = this.queue.shift()!;
        yield current;
      }
    } finally {
      this.isEmitting = false;
    }
  }
}
