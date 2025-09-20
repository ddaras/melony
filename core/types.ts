export type ToolCall = {
  id: string;
  name: string;
  args?: Record<string, any>;
  status?: "pending" | "streaming" | "completed" | "error";
  inputStream?: string; // Accumulated input during streaming
};

export type ToolResult = {
  output?: any;
  toolCallId?: string;
};

export type Role = "user" | "assistant" | "system";

export type ToolMessagePart = {
  type: "tool";
  toolCallId: string;
  toolName: string;
  status: "pending" | "streaming" | "completed" | "error";
  inputStream?: string;
  input?: Record<string, any>;
  output?: any;
};

export type TextMessagePart = {
  type: "text";
  text: string;
};

export type ReasoningMessagePart = {
  type: "reasoning";
  text: string;
};

export type MessagePart =
  | TextMessagePart
  | ReasoningMessagePart
  | ToolMessagePart;

export type BaseMessage = {
  id: string;
  role: Role;
  parts: MessagePart[];
  createdAt: number;
  metadata?: Record<string, any>;
};

export type FormField = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox";
  options?: string[];
};

// Streaming event type
export type StreamingEvent =
  | { type: "start"; id: string }
  | { type: "start-step"; id: string }
  | { type: "text-start"; id: string }
  | { type: "text-delta"; id: string; delta: string }
  | { type: "text-end"; id: string }
  | { type: "tool-start"; id: string; toolCallId: string; toolName: string }
  | { type: "tool-delta"; id: string; toolCallId: string; delta: string }
  | { type: "tool-end"; id: string; toolCallId: string }
  | {
      type: "tool-call";
      id: string;
      toolCallId: string;
      toolName: string;
      input: Record<string, any>;
    }
  | {
      type: "tool-result";
      id: string;
      toolCallId: string;
      toolName: string;
      input: Record<string, any>;
      output: any;
    }
  | { type: "finish-step"; id: string }
  | { type: "finish"; id: string };

export type SubscribeCallback = (message: BaseMessage) => void;
export type Subscription = { unsubscribe: () => void };

// streaming handler
export interface StreamingHandler {
  send(messages: string): Promise<void>;
  subscribe(callback: SubscribeCallback): Subscription;
  dispose?(): void;
}

export interface StreamingHandlerOptions {
  api: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  debug?: boolean;
}
