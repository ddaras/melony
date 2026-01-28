import type { Event } from "melony";

type ChatEventBase<T extends string, D> = Event<D> & { type: T };

export type InitEvent = ChatEventBase<"init", Record<string, never>>;
export type UserTextEvent = ChatEventBase<"user:text", { content: string }>;
export type AssistantTextEvent = ChatEventBase<"assistant:text", { content: string }>;

export type ChatEvent = InitEvent | UserTextEvent | AssistantTextEvent;

export interface ChatState {
  lastUserMessage?: string;
}

export interface ChatRequest {
  event: ChatEvent;
  runId?: string;
}
