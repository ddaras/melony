import { Event, RuntimeContext } from "melony";

export interface LlmMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  toolCallId?: string;
}

export interface LlmTool {
  name: string;
  description: string;
  parameters: any;
}

export interface LlmProviderEvent {
  type: "text:delta" | "text:done" | "tool:call" | "done" | "error";
  text?: string;
  callId?: string;
  name?: string;
  input?: any;
  finishReason?: string;
  error?: any;
}

export interface LlmProvider<TState = any, TEvent extends Event = Event> {
  name: string;
  generate(args: {
    system?: string;
    messages: LlmMessage[];
    tools?: LlmTool[];
    temperature?: number;
    maxOutputTokens?: number;
    context: RuntimeContext<TState, TEvent>;
  }): AsyncGenerator<LlmProviderEvent>;
}

export interface LlmPluginOptions<TState = any, TEvent extends Event = Event> {
  provider: LlmProvider<TState, TEvent>;
  temperature?: number;
  maxOutputTokens?: number;
  maxSteps?: number;
  messageSelector?: (ctx: RuntimeContext<TState, TEvent>) => LlmMessage[];
  toolSelector?: (ctx: RuntimeContext<TState, TEvent>) => LlmTool[];
}
