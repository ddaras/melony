import { MelonyBuilder, RuntimeContext } from "melony";

export type Instructions<TState = any, TEvent = any> =
  | string
  | ((context: RuntimeContext<TState, TEvent>) => string | Promise<string>);

export interface AgentState {
  agent?: {
    name: string;
    description?: string;
    instructions?: Instructions<any, any>;
  };
  [key: string]: any;
}

export type AgentPlugin<TState = any, TEvent = any> = (
  builder: MelonyBuilder<TState, TEvent>
) => void;

export interface AgentConfig<TState = any, TEvent = any> {
  name: string;
  description?: string;
  instructions?: Instructions<TState, TEvent>;
}

export const AgentEvents = {
  Run: "agent:run",
  Complete: "agent:complete"
} as const;
