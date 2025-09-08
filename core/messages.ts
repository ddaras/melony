import { ToolCall, ToolResult } from "./tools";

export type Role = "user" | "assistant" | "system" | "tool";

export type MessagePart =
  | { type: "text"; text: string }
  | { type: "image"; url: string; alt?: string }
  | { type: "table"; columns: string[]; rows: any[][] }
  | { type: "form"; fields: FormField[] }
  | { type: "detail"; data: Record<string, any> }
  | { type: "chart"; kind: "bar" | "line" | "pie"; data: any }
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
      | "response";
    activeToolCallId?: string;
  };
};

export type FormField = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox";
  options?: string[];
};
