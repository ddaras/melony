import type { Event } from "melony";
import type { UIEvent } from "@melony/ui-kit";
import type { BrowserStatusEvent, BrowserStateUpdateEvent } from "@melony/plugin-browser";
import type { ShellStatusEvent } from "@melony/plugin-shell";
import type { FileSystemStatusEvent } from "@melony/plugin-file-system";

type ChatEventBase<T extends string, D> = Event<D> & { type: T };

export type InitEvent = ChatEventBase<"init", { platform: string; version?: string; tab?: string }>;
export type UserTextEvent = ChatEventBase<"user:text", { content: string }>;
export type AssistantTextEvent = ChatEventBase<"assistant:text", { content: string }>;

export type ActionResultEvent = ChatEventBase<"action:result", { action: string; result: any; toolCallId?: string; error?: string }>;
export type ActionEvent = ChatEventBase<`action:${string}`, any>;
export type AgentOSInputEvent = ChatEventBase<"agent:os:input", { content: string }>;
export type AgentBrowserInputEvent = ChatEventBase<"agent:browser:input", { content: string }>;

export type AgentOSOutputEvent = ChatEventBase<"agent:os:output", { content: string }>;
export type AgentBrowserOutputEvent = ChatEventBase<"agent:browser:output", { content: string }>;

export type ChatEvent =
  | InitEvent
  | UserTextEvent
  | AssistantTextEvent
  | UIEvent
  | BrowserStatusEvent
  | BrowserStateUpdateEvent
  | ShellStatusEvent
  | FileSystemStatusEvent
  | ActionResultEvent
  | ActionEvent
  | AgentOSInputEvent
  | AgentBrowserInputEvent
  | AgentOSOutputEvent
  | AgentBrowserOutputEvent;

export interface ChatState {
  title?: string;
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
