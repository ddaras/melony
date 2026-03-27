import {
  RuntimeContext,
  Config,
  RunOptions,
} from "./types";
import { generateId } from "./utils/generate-id";

/**
 * The Melony Runtime.
 * Fully unopinionated - processes events through handlers.
 */
export class Runtime<TState = any, TEvent = any> {
  public readonly config: Config<TState, TEvent>;

  constructor(config: Config<TState, TEvent>) {
    this.config = config;
  }

  /**
   * Helper to get the event type from an event object based on configuration.
   */
  private getEventType(event: TEvent): string {
    const key = this.config.eventKey || "type";
    return (event as any)[key] || "*";
  }

  /**
   * Helper to check if a value is a Melony Event.
   */
  private isEvent(val: any): val is TEvent {
    const key = this.config.eventKey || "type";
    return val && typeof val === "object" && typeof (val as any)[key] === "string";
  }

  /**
   * Process an incoming event through the runtime.
   * All event processing is handled by user-defined event handlers.
   */
  public async *run(
    event: TEvent,
    options?: RunOptions<TState>
  ): AsyncGenerator<TEvent> {
    const runId = options?.runId ?? generateId();
    const eventKey = this.config.eventKey || "type";

    // Resolve initial state: options.state > config.initialState > {}
    let state: TState;
    if (options?.state) {
      state = options.state;
    } else if (typeof this.config.initialState === "function") {
      state = await (this.config.initialState as any)();
    } else if (this.config.initialState) {
      // Use structuredClone if available, otherwise fallback to simple spread for safety
      state = typeof (globalThis as any).structuredClone === "function"
        ? (globalThis as any).structuredClone(this.config.initialState)
        : { ...this.config.initialState };
    } else {
      state = {} as TState;
    }

    const context: RuntimeContext<TState, TEvent> = {
      state,
      runtime: this,
      runId,
      suspend: (event?: TEvent) => {
        throw event || { [eventKey]: "run-suspended", data: {} };
      },
    };

    try {
      // Process the incoming event through handlers
      yield* this.runEventHandlers(event, context);
    } catch (error) {
      let eventToEmit: TEvent | undefined;

      if (this.isEvent(error)) {
        eventToEmit = error as TEvent;
      } else {
        eventToEmit = {
          [eventKey]: "error",
          data: {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
        } as unknown as TEvent;
      }

      if (eventToEmit) {
        yield* this.runEventHandlers(eventToEmit, context);
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
    const eventKey = this.config.eventKey || "type";

    // 1. Run global interceptors first
    const globalInterceptors = this.config.interceptors.get("*") || [];
    for (const interceptor of globalInterceptors) {
      const result = await interceptor(currentEvent, context);
      if (result && typeof result === "object" && eventKey in (result as any)) {
        currentEvent = result as TEvent;
      }
    }

    // 2. Run specific interceptors for the (possibly new) event type
    // If currentEvent type is "*", it's already been handled by the global interceptors
    const eventType = this.getEventType(currentEvent);
    if (eventType !== "*") {
      const specificInterceptors = this.config.interceptors.get(eventType) || [];
      for (const interceptor of specificInterceptors) {
        const result = await interceptor(currentEvent, context);
        if (result && typeof result === "object" && eventKey in (result as any)) {
          currentEvent = result as TEvent;
        }
      }
    }

    const handlers = [
      ...(this.config.handlers.get("*") || []),
      ...(this.config.handlers.get(this.getEventType(currentEvent)) || []),
    ];

    // First emit the event itself
    yield* this.emit(currentEvent);

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
    event: TEvent
  ): AsyncGenerator<TEvent> {
    yield event;
  }
}
