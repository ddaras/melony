import {
  Action,
  Event,
  EventHandler,
  Config,
  ActionExecute,
  RuntimeContext,
} from "./types";
import { Runtime } from "./runtime";
import { createStreamResponse } from "./utils/create-stream-response";

/**
 * Fluent builder for creating Melony agents with excellent developer experience.
 * Provides method chaining for actions and plugins with full TypeScript support.
 */
export class MelonyBuilder<
  TState = any,
  TEvent extends Event = Event
> {
  private config: Config<TState, TEvent>;

  constructor(initialConfig?: Partial<Config<TState, TEvent>>) {
    this.config = {
      actions: {},
      eventHandlers: new Map(),
      ...initialConfig,
    };

    // Add built-in call-action handler
    this.addBuiltInHandlers();
  }

  /**
   * Add built-in event handlers that are available in all agents.
   */
  private addBuiltInHandlers(): void {
    // Built-in call-action handler
    this.on("call-action", async function* (event, context) {
      const { action: actionName, params } = event.data as { action: string; params: unknown };

      // Execute the action (runtime will automatically emit action:before and action:after events)
      yield* context.runtime.execute(actionName, params);
    });
  }

  /**
   * Add an action to the agent with fluent method chaining.
   * Supports two patterns:
   * - Pass a pre-defined Action object
   * - Define action inline with name and handler
   */
  action<TParams = any>(
    action: Action<TParams, any, any>
  ): this;
  action<TParams = any>(
    name: string,
    execute: ActionExecute<TParams, any, any>
  ): this;
  action<TParams = any>(
    nameOrAction: string | Action<TParams, any, any>,
    execute?: ActionExecute<TParams, any, any>
  ): this {
    if (typeof nameOrAction !== 'string') {
      // Called as: .action(action) - pre-defined action object
      // Auto-cast to agent types for better DX
      const typedAction: Action<TParams, TState, TEvent> = {
        name: nameOrAction.name,
        execute: nameOrAction.execute as ActionExecute<TParams, TState, TEvent>,
      };
      this.config.actions[nameOrAction.name] = typedAction;
      return this;
    }

    // Called as: .action(name, execute)
    const name = nameOrAction;
    const actionObj: Action<TParams, TState, TEvent> = {
      name,
      execute: execute! as ActionExecute<TParams, TState, TEvent>,
    };
    this.config.actions[name] = actionObj;
    return this;
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
  async stream(
    event: TEvent,
    options?: { state?: TState }
  ): Promise<Response> {
    const runtime = this.build();
    const generator = runtime.run(event);
    return createStreamResponse(generator);
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