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

export type MessagePart =
  | { type: "text"; text: string }
  | { type: "reasoning"; text: string }
  | {
      type: "tool";
      toolCallId: string;
      status: string;
      inputStream?: string;
      input?: Record<string, any>;
      output?: any;
    };

export type Message = {
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

// Streaming event types to match the new message flow
export type StreamingEvent =
  | { type: "start" }
  | { type: "start-step" }
  | { type: "text-start"; id: string; providerMetadata?: Record<string, any> }
  | { type: "text-delta"; id: string; delta: string }
  | { type: "text-end"; id: string }
  | { type: "finish-step" }
  | { type: "finish" };
