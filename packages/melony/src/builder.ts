import {
  Event,
  EventHandler,
  Config,
  RuntimeContext,
} from "./types";
import { Runtime } from "./runtime";
import { createStreamResponse } from "./utils/create-stream-response";

/**
 * A Melony plugin is a function that receives the builder and extends it.
 * This allows for modularizing common handlers.
 */
export type MelonyPlugin<TState = any, TEvent extends Event = Event> = (
  builder: MelonyBuilder<TState, TEvent>
) => void;

/**
 * Fluent builder for creating Melony agents with excellent developer experience.
 * Provides method chaining for handlers and plugins with full TypeScript support.
 */
export class MelonyBuilder<
  TState = any,
  TEvent extends Event = Event
> {
  private config: Config<TState, TEvent>;

  constructor(initialConfig?: Partial<Config<TState, TEvent>>) {
    this.config = {
      eventHandlers: initialConfig?.eventHandlers ?? new Map(),
    };
  }

  /**
   * Add an event handler for a specific event type. Supports method chaining.
   * The handler receives the narrowed event type based on the eventType string.
   */
  on<K extends TEvent["type"]>(
    eventType: K,
    handler: (
      event: Extract<TEvent, { type: K }>,
      context: RuntimeContext<TState, TEvent>
    ) => AsyncGenerator<TEvent, void, unknown> | void
  ): this {
    if (!this.config.eventHandlers.has(eventType)) {
      this.config.eventHandlers.set(eventType, []);
    }
    // Cast is safe because runtime only calls this handler for matching event types
    this.config.eventHandlers.get(eventType)!.push(handler as EventHandler<TState, TEvent>);
    return this;
  }

  /**
   * Use a plugin to extend the builder.
   * This is ideal for modularizing common handlers.
   */
  use(plugin: MelonyPlugin<TState, TEvent>): this {
    plugin(this);
    return this;
  }

  /**
   * Build and return the Melony runtime instance.
   * This is the final method in the fluent chain.
   */
  build(): Runtime<TState, TEvent> {
    return new Runtime(this.config);
  }

  /**
   * Execute and stream the response for an event.
   * This is a convenience method that builds the runtime and calls run().
   */
  async streamResponse(
    event: TEvent,
    options?: { state?: TState; runId?: string }
  ): Promise<Response> {
    const runtime = this.build();
    const generator = runtime.run(event, options);
    return createStreamResponse(generator);
  }

  /**
   * Execute the agent and return the data from the last event of a specific type as a JSON response.
   * Ideal for initialization or non-streaming requests where you only need the final UI state.
   */
  async jsonResponse(
    event: TEvent,
    options?: {
      state?: TState;
      runId?: string;
      targetType?: string; // Default to "ui"
    }
  ): Promise<Response> {
    const targetType = options?.targetType ?? "ui";
    const runtime = this.build();
    let data = null;

    for await (const e of runtime.run(event, options)) {
      if (e.type === targetType) {
        data = e.data;
      }
    }

    return new Response(JSON.stringify({ data }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  /**
   * Get the current configuration (useful for debugging or serialization).
   */
  getConfig(): Config<TState, TEvent> {
    return { ...this.config };
  }
}

/**
 * Factory function to create a new Melony builder instance.
 * This is the entry point for the fluent API.
 */
export function melony<
  TState = any,
  TEvent extends Event = Event
>(initialConfig?: Partial<Config<TState, TEvent>>): MelonyBuilder<TState, TEvent> {
  return new MelonyBuilder<TState, TEvent>(initialConfig);
}
