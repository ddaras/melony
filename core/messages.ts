import { ToolCall, ToolResult } from "./tools";

export type Role = "user" | "assistant" | "system" | "tool";

export type UIBlock =
  | { type: "text"; value: string }
  | { type: "image"; url: string; alt?: string }
  | { type: "table"; columns: string[]; rows: any[][] }
  | { type: "form"; fields: FormField[] }
  | { type: "detail"; data: Record<string, any> }
  | { type: "chart"; kind: "bar" | "line" | "pie"; data: any };

export type Message = {
  id: string;
  role: Role;
  content: string | UIBlock[];
  toolCall?: ToolCall;
  toolResult?: ToolResult;
  createdAt: number;
  metadata?: Record<string, any>;
};

export type FormField = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox";
  options?: string[];
};
