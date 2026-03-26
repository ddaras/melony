import { melony, MelonyBuilder, generateId } from "melony";
import { AgentConfig, AgentPlugin, AgentEvents, AgentState } from "./types";

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

    // Core internal identity plugin
    this.builder.use((b) => {
      b.intercept((event, context) => {
        // Inject identity into state if not present
        if (!context.state.agent) {
          context.state.agent = {
            name: this.config.name,
            description: this.config.description,
            instructions: this.config.instructions
          };
        }
        return event;
      });
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
   * Run the agent and stream events as they occur.
   */
  run(input: any, options?: { state?: TState; runId?: string }): AsyncGenerator<TEvent> {
    const runtime = this.builder.build();
    const event = { type: AgentEvents.Run, data: input } as TEvent;
    const self = this;
    const runId = options?.runId ?? generateId();

    return (async function* () {
      try {
        yield* runtime.run(event, { ...options, runId });
      } finally {
        yield* runtime.run({
          type: AgentEvents.Complete,
          data: { agent: self.config.name }
        } as TEvent, { ...options, runId });
      }
    })();
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
