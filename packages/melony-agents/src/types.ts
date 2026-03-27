import { MelonyBuilder, RuntimeContext } from "melony";

export type Instructions<TState = unknown, TEvent = unknown> =
  | string
  | ((context: RuntimeContext<TState, TEvent>) => string | Promise<string>);

export interface AgentState {
  agent?: {
    name: string;
    description?: string;
    instructions?: unknown;
  };
  [key: string]: unknown;
}

export type AgentPlugin<TState = unknown, TEvent = unknown> = (
  builder: MelonyBuilder<TState, TEvent>
) => void;

export interface AgentConfig<TState = unknown, TEvent = unknown> {
  name: string;
  description?: string;
  instructions?: Instructions<TState, TEvent>;
  /**
   * The initial state for the agent.
   * Can be an object or a factory function (sync or async).
   */
  initialState?: TState | (() => TState | Promise<TState>);
}

export const AgentEvents = {
  // Triggered by the outside world (Request/CLI)
  UserIntent: "user:intent",

  // Core Agent Commands
  Run: "agent:run",
  Complete: "agent:complete",
  Error: "agent:error",

  // Granular Thinking Events
  Step: "agent:step",
  StepNext: "agent:step:next",
  Thought: "agent:thought",
  Action: "agent:action",
  Result: "agent:result"
} as const;
