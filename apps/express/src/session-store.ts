import { LlmMessage } from "@melony/llm";

const sessionMessages = new Map<string, LlmMessage[]>();

export const getSessionMessages = (sessionId: string): LlmMessage[] => {
  return sessionMessages.get(sessionId) || [];
};

export const setSessionMessages = (sessionId: string, messages: LlmMessage[]): void => {
  sessionMessages.set(sessionId, messages);
};

export const resolveSessionId = (rawSessionId: unknown): string => {
  const resolvedSessionId =
    typeof rawSessionId === "string" && rawSessionId.trim() ? rawSessionId.trim() : undefined;
  return resolvedSessionId || "default";
};
