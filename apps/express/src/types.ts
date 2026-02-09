import type { Event } from "melony";
import type { UIEvent } from "@melony/ui-kit";
import type { BrowserStatusEvent, BrowserStateUpdateEvent } from "@melony/plugin-browser";
import type { ShellStatusEvent } from "@melony/plugin-shell";
import type { FileSystemStatusEvent } from "@melony/plugin-file-system";

type ChatEventBase<T extends string, D> = Event<D> & { type: T };

export type InitEvent = ChatEventBase<"init", { platform: string; version?: string; tab?: string }>;
export type UserTextEvent = ChatEventBase<"user:text", { content: string }>;
export type AssistantTextEvent = ChatEventBase<"assistant:text", { content: string }>;

export type ChatEvent =
  | InitEvent
  | UserTextEvent
  | AssistantTextEvent
  | UIEvent
  | BrowserStatusEvent
  | BrowserStateUpdateEvent
  | ShellStatusEvent
  | FileSystemStatusEvent;

export interface ChatState {
  sessionId?: string;
  lastUserMessage?: string;
  messages?: any[];
  cwd?: string;
  workspaceRoot?: string;
}

export interface ChatRequest {
  event: ChatEvent;
  runId?: string;
  sessionId?: string;
}
