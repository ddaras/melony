import { useMelonyRuntime, ChatMessage } from "./use-melony-runtime";

// Re-export ChatMessage for backward compatibility
export type { ChatMessage };

/**
 * Chat-specific hook that wraps useMelonyRuntime with chat mode enabled
 * This is now a thin wrapper around useMelonyRuntime for backward compatibility
 */
export function useMelonyChat(options: { api?: string; threadId?: string } = {}) {
  const { api = "/api/chat", threadId } = options;

  const {
    messages = [],
    isLoading,
    sendMessage,
    clear,
    threadId: runtimeThreadId,
  } = useMelonyRuntime({
    api,
    threadId,
  });

  return {
    messages,
    isLoading,
    sendMessage: sendMessage!,
    clear,
    threadId: runtimeThreadId,
  };
}
