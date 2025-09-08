export type ToolCall = { name: string; args?: Record<string, any> };
export type ToolResult = { success: boolean; output?: any };
