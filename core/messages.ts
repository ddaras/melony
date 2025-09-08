export type Role = 'user' | 'assistant' | 'tool' | 'system';

export interface BaseMessage {
  id: string;
  role: Role;
  createdAt: number;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
}

export interface ToolCallMessage extends BaseMessage {
  type: 'tool-call';
  toolName: string;
  args: unknown;
}

export interface ToolResultMessage extends BaseMessage {
  type: 'tool-result';
  toolName: string;
  result: unknown;
}

export type Message = TextMessage | ToolCallMessage | ToolResultMessage;

export function isTextMessage(m: Message): m is TextMessage {
  return m.type === 'text';
}
