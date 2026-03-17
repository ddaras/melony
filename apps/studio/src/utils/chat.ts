import { ChatMessage, RuntimeMessage } from '../types/studio';

export const createId = (): string => crypto.randomUUID();

export const extractEventText = (event: any): string => {
  if (typeof event?.text === 'string') return event.text;
  if (typeof event?.data === 'string') return event.data;
  if (typeof event?.data?.text === 'string') return event.data.text;
  if (typeof event?.message === 'string') return event.message;
  if (typeof event?.data?.message === 'string') return event.data.message;
  return '';
};

const toChatRole = (role: unknown): ChatMessage['role'] => {
  if (role === 'user' || role === 'assistant' || role === 'error') {
    return role;
  }
  return 'assistant';
};

export const normalizeRuntimeMessages = (messages: unknown): ChatMessage[] => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return (messages as RuntimeMessage[])
    .filter((entry) => typeof entry?.content === 'string' && entry.content.trim().length > 0)
    .map((entry) => ({
      id: createId(),
      role: toChatRole(entry.role),
      content: entry.content as string
    }));
};
