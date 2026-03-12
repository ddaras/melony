import { Event, MelonyBuilder, RuntimeContext } from "melony";

export type Instructions<TState = any, TEvent extends Event = Event> =
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

export type AgentPlugin<TState = any, TEvent extends Event = Event> = (
  builder: MelonyBuilder<TState, TEvent>
) => void;

export interface AgentConfig<TState = any, TEvent extends Event = Event> {
  name: string;
  description?: string;
  instructions?: Instructions<TState, TEvent>;
}

export const AgentEvents = {
  Run: "agent:run",
  Complete: "agent:complete"
} as const;
