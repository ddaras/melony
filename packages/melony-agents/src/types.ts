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
}

export const AgentEvents = {
  Run: "agent:run",
  Complete: "agent:complete"
} as const;
