import {
  EventHandler,
  Config,
  RuntimeContext,
  EventInterceptor,
} from "./types";
import { Runtime } from "./runtime";
import { createStreamResponse } from "./utils/create-stream-response";
import { generateId } from "./utils/generate-id";

/**
 * A Melony plugin is a function that receives the builder and extends it.
 * This allows for modularizing common handlers.
 */
export type MelonyPlugin<TState = any, TEvent = any> = (
  builder: MelonyBuilder<TState, TEvent>
) => void;

/**
 * Fluent builder for creating Melony agents with excellent developer experience.
 * Provides method chaining for handlers and plugins with full TypeScript support.
 */
export class MelonyBuilder<
  TState = any,
  TEvent = any
> {
  private config: Config<TState, TEvent>;

  constructor(initialConfig?: Partial<Config<TState, TEvent>>) {
    this.config = {
      handlers: initialConfig?.handlers ?? new Map(),
      interceptors: initialConfig?.interceptors ?? new Map(),
      eventKey: initialConfig?.eventKey ?? "type",
    };
  }

  /**
   * Configure the key in the event object that defines its type.
   * Defaults to "type".
   */
  eventKey(key: string): this {
    this.config.eventKey = key;
    return this;
  }

  /**
   * Add an event handler for a specific event type. Supports method chaining.
   * The handler receives the narrowed event type based on the eventType string.
   */
  on(
    eventType: string | "*",
    handler: (
      event: TEvent,
      context: RuntimeContext<TState, TEvent>
    ) => AsyncGenerator<TEvent, void, unknown> | void
  ): this {
    if (!this.config.handlers.has(eventType)) {
      this.config.handlers.set(eventType, []);
    }
    // Cast is safe because runtime only calls this handler for matching event types
    this.config.handlers.get(eventType)!.push(handler as EventHandler<TState, TEvent>);
    return this;
  }

  /**
   * Register an interceptor that runs before any handlers.
   * Useful for logging, validation, or suspending for approval.
   */
  intercept(interceptor: EventInterceptor<TState, TEvent>): this;
  intercept(
    eventType: string,
    interceptor: (
      event: TEvent,
      context: RuntimeContext<TState, TEvent>
    ) => Promise<TEvent | void> | TEvent | void
  ): this;
  intercept(
    arg1: string | EventInterceptor<TState, TEvent>,
    arg2?: any
  ): this {
    if (typeof arg1 === "string") {
      const type = arg1;
      const interceptor = arg2!;
      if (!this.config.interceptors.has(type)) {
        this.config.interceptors.set(type, []);
      }
      this.config.interceptors.get(type)!.push(interceptor as EventInterceptor<TState, TEvent>);
    } else {
      const interceptor = arg1;
      if (!this.config.interceptors.has("*")) {
        this.config.interceptors.set("*", []);
      }
      this.config.interceptors.get("*")!.push(interceptor);
    }
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
   * A unified Web-Standard Request Handler.
   * Automatically parses a Request and returns a streaming Response.
   */
  async handle(request: Request, options?: { 
    state?: (req: Request) => Promise<TState> | TState 
  }): Promise<Response> {
    // 1. Handle Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-melony-thread-id, x-melony-run-id, Authorization",
        },
      });
    }

    // 2. Extract Event from Body
    let event: TEvent;
    try {
      if (request.method === "POST") {
        event = await request.json();
      } else {
        const url = new URL(request.url);
        event = { 
          [this.config.eventKey || "type"]: url.searchParams.get("type") || "run",
          data: Object.fromEntries(url.searchParams.entries())
        } as unknown as TEvent;
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
      });
    }

    // 3. Resolve State and Run Metadata
    const threadId = request.headers.get("x-melony-thread-id") || (event as any).threadId || generateId();
    const runId = request.headers.get("x-melony-run-id") || generateId();

    const state = options?.state 
      ? await options.state(request) 
      : ({ threadId, runId } as unknown as TState);

    // 4. Stream Response
    const response = await this.streamResponse(event, { state, runId });
    
    // Add CORS to response
    response.headers.set("Access-Control-Allow-Origin", "*");
    
    return response;
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
    }
  ): Promise<Response> {
    const events = [];
    const runtime = this.build();

    for await (const e of runtime.run(event, options)) {
      events.push(e);
    }

    return new Response(JSON.stringify({ events }), {
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
  TEvent = any
>(initialConfig?: Partial<Config<TState, TEvent>>): MelonyBuilder<TState, TEvent> {
  return new MelonyBuilder<TState, TEvent>(initialConfig);
}
