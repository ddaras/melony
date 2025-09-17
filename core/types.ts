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
  | { type: "tool"; toolCallId: string; status: string; inputStream?: string };

export type Message = {
  id: string;
  role: Role;
  parts: MessagePart[];
  toolCalls?: ToolCall[]; // Support multiple tool calls
  toolResults?: ToolResult[]; // Support multiple tool results
  createdAt: number;
  metadata?: Record<string, any>;
  streamingState?: {
    isStreaming: boolean;
    currentStep?:
      | "thinking"
      | "tool-input"
      | "tool-execution"
      | "tool-output"
      | "response"
      | "start"
      | "start-step"
      | "text-start"
      | "text-streaming"
      | "text-end"
      | "finish-step"
      | "finish";
    activeToolCallId?: string;
    textId?: string; // ID for the current text being streamed
  };
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
