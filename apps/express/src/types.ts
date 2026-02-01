import type { Event } from "melony";

type ChatEventBase<T extends string, D> = Event<D> & { type: T };

export type InitEvent = ChatEventBase<"init", { platform: string; version?: string }>;
export type UserTextEvent = ChatEventBase<"user:text", { content: string }>;
export type AssistantTextEvent = ChatEventBase<"assistant:text", { content: string }>;

export type ChatEvent = InitEvent | UserTextEvent | AssistantTextEvent;

export interface ChatState {
  lastUserMessage?: string;
  messages?: any[];
}

export interface ChatRequest {
  event: ChatEvent;
  runId?: string;
  sessionId?: string;
}
