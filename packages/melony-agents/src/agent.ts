import { melony, MelonyBuilder, generateId, RunOptions, RuntimeContext } from "melony";
import { AgentConfig, AgentPlugin, AgentEvents, AgentState } from "./types";

/**
 * Helper to resolve agent instructions from state.
 */
export async function resolveInstructions(context: RuntimeContext<any, any>): Promise<string | undefined> {
  const state = context.state as AgentState;
  const instructions = state.agent?.instructions;
  if (typeof instructions === "function") {
    return await instructions(context);
  }
  return instructions as string | undefined;
}

/**
 * The AgentBuilder provides a delightful, fluent API for defining agents.
 * It's built on top of the Melony event runtime, treating everything as a plugin.
 */
export class AgentBuilder<TState extends AgentState = AgentState, TEvent = any> {
  private config: AgentConfig<TState, TEvent>;
  private builder: MelonyBuilder<TState, TEvent>;

  constructor(config: AgentConfig<TState, TEvent>) {
    this.config = config;
    this.builder = melony<TState, TEvent>();
    const agentIdentity = {
      name: this.config.name,
      description: this.config.description,
      instructions: this.config.instructions,
    };

    this.builder.initialState(async () => {
      const baseState = config.initialState
        ? typeof config.initialState === "function"
          ? await config.initialState()
          : config.initialState
        : ({} as TState);

      if (!baseState.agent) {
        baseState.agent = agentIdentity;
      }

      return baseState;
    });

    // Core internal identity and lifecycle plugin
    this.builder.use((b) => {
      b.intercept((event, context) => {
        // Fallback for externally supplied run state that bypasses initialState.
        if (!context.state.agent) {
          context.state.agent = agentIdentity;
        }
        return event;
      });

      // Standard Agent Loop: agent:run -> agent:step -> agent:step:next
      b.on(AgentEvents.Run, async function* (event: any) {
        yield { 
          type: AgentEvents.Step, 
          data: { step: 1, input: event.data } 
        } as any;
      });

      b.on(AgentEvents.StepNext, async function* (event: any) {
        const step = event.data?.step || 1;
        // Limit steps to prevent infinite loops if not configured otherwise
        if (step > 10) {
          yield { 
            type: AgentEvents.Error, 
            data: { message: "Max steps reached" } 
          } as any;
          return;
        }

        yield { 
          type: AgentEvents.Step, 
          data: { step } 
        } as any;
      });

      // No completion mapping from run:status.
      // Agent lifecycle events are emitted by the agent execution flow itself.
    });
  }

  /**
   * Add a capability plugin (brain, memory, tools, etc.).
   */
  use(plugin: AgentPlugin<TState, TEvent>): this {
    this.builder.use(plugin);
    return this;
  }

  /**
   * Register an event handler directly on the agent.
   * This is a convenience wrapper around the underlying Melony builder.
   */
  on(
    eventType: string | "*",
    handler: (
      event: TEvent,
      context: RuntimeContext<TState, TEvent>
    ) => AsyncGenerator<TEvent, void, unknown> | void
  ): this {
    this.builder.on(eventType, handler);
    return this;
  }

  /**
   * Run the agent and stream events as they occur.
   */
  run(input: any, options?: RunOptions<TState>): AsyncGenerator<TEvent> {
    const runtime = this.builder.build();
    const event = typeof input === "string" 
      ? { type: AgentEvents.UserIntent, data: { text: input } } as TEvent
      : (input.type ? input : { type: AgentEvents.Run, data: input }) as TEvent;

    return runtime.run(event, options);
  }

  /**
   * Configure the initial state for the agent.
   * Supports a static object or a factory function.
   */
  initialState(state: TState | (() => TState | Promise<TState>)): this {
    this.builder.initialState(state);
    return this;
  }

  /**
   * Handle a web-standard Request and return a streaming Response.
   */
  async handle(request: Request, options?: { state?: (req: Request) => Promise<TState> | TState }): Promise<Response> {
    return this.builder.handle(request, options);
  }

}

/**
 * Factory function to create a new agent.
 */
export function agent<TState extends AgentState = AgentState, TEvent = any>(config: string | AgentConfig<TState, TEvent>) {
  const actualConfig = typeof config === "string" ? { name: config } : config;
  return new AgentBuilder<TState, TEvent>(actualConfig);
}
