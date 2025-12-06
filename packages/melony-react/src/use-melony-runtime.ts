import { useEffect, useMemo, useState, useRef } from "react";
import { generateId, MelonyEvent } from "@melony/core";
import {
  TransportFn,
  createHttpTransport,
  ChatMessage,
  TransportRequest,
} from "@melony/client";

// Re-export ChatMessage from client
export type { ChatMessage };

export interface UseMelonyRuntimeOptions {
  transport?: TransportFn;
  api?: string;
  threadId?: string; // Optional: provide existing threadId, or one will be generated
}

export interface UseMelonyRuntimeReturn {
  events: MelonyEvent[];
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  threadId: string; // Current thread ID
  sendMessage: (input: {
    role: "user" | "system";
    content: MelonyEvent[];
  }) => Promise<void>;
  clear: () => void;
}

/**
 * Merge an event into the messages array (chat-specific logic)
 */
function mergeMessageEvent(
  messages: ChatMessage[],
  event: MelonyEvent
): ChatMessage[] {
  const lastMsg = messages[messages.length - 1];
  const isAssistant = lastMsg?.role === "assistant";
  const isSameGroup =
    isAssistant &&
    lastMsg.runId &&
    event.runId &&
    lastMsg.runId === event.runId;

  if (isSameGroup) {
    const currentContent = Array.isArray(lastMsg.content)
      ? lastMsg.content
      : [];

    // Handle text merging
    if (event.type === "text") {
      const isDone = event.data?.state === "done";

      // Find the last text event that's not done
      let lastTextEventIndex = -1;
      for (let i = currentContent.length - 1; i >= 0; i--) {
        const e = currentContent[i];
        if (e.type === "text" && e.data?.state !== "done") {
          lastTextEventIndex = i;
          break;
        }
      }

      if (isDone && lastTextEventIndex !== -1) {
        // Replace the last text event with final text
        const newContent = [...currentContent];
        newContent[lastTextEventIndex] = event;
        return [...messages.slice(0, -1), { ...lastMsg, content: newContent }];
      } else if (!isDone && lastTextEventIndex !== -1) {
        // Merge delta events
        const lastEvent = currentContent[lastTextEventIndex];
        const updatedLastEvent = {
          ...lastEvent,
          data: {
            ...lastEvent.data,
            content:
              (lastEvent.data?.content || "") + (event.data?.content || ""),
            state: event.data?.state,
          },
        };
        const newContent = [...currentContent];
        newContent[lastTextEventIndex] = updatedLastEvent;
        return [...messages.slice(0, -1), { ...lastMsg, content: newContent }];
      }
    }

    // Add as new event
    return [
      ...messages.slice(0, -1),
      { ...lastMsg, content: [...currentContent, event] },
    ];
  } else {
    // Create a new message group
    return [
      ...messages,
      {
        role: "assistant",
        runId: event.runId,
        content: [event],
      },
    ];
  }
}

export function useMelonyRuntime(
  options: UseMelonyRuntimeOptions = {}
): UseMelonyRuntimeReturn {
  const {
    transport: transportOption,
    api,
    threadId: initialThreadId,
  } = options;

  const transport = useMemo<TransportFn>(() => {
    if (transportOption) {
      return transportOption as TransportFn;
    }
    if (api) return createHttpTransport(api);
    throw new Error("Must provide transport or api");
  }, [transportOption, api]);

  const [events, setEvents] = useState<MelonyEvent[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [threadId, setThreadId] = useState<string>(
    initialThreadId || generateId()
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (input: {
    role: "user" | "system";
    content: MelonyEvent[];
  }) => {
    // Abort previous run if still in progress
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    // Content is always an events array
    // Optimistic UI - add user/system message immediately
    // Client messages: role is user/system, content is array of events
    const newMessage: ChatMessage = {
      role: input.role,
      content: input.content,
      // No runId for client messages (only assistant messages from backend have runId)
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      const signal = abortControllerRef.current.signal;
      // Send only the new message with threadId - backend can fetch history if needed
      const transportRequest: TransportRequest = {
        message: newMessage,
        threadId: threadId,
      };
      const stream = await transport(transportRequest, signal);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (abortControllerRef.current?.signal.aborted) {
          reader.cancel();
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            try {
              const event: MelonyEvent = JSON.parse(line.slice(6));
              setEvents((prev) => [...prev, event]);

              // Always update messages with event merging
              setMessages((prev) => mergeMessageEvent(prev, event));
            } catch (e) {
              console.error("Failed to parse event:", e);
            }
          }
        }
      }

      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setIsLoading(false);
        return;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsLoading(false);
    }
  };

  const clear = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setEvents([]);
    setMessages([]);
    setError(null);
    setIsLoading(false);
    // Generate a new threadId when clearing
    setThreadId(generateId());
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    events,
    messages,
    isLoading,
    error,
    threadId,
    sendMessage,
    clear,
  };
}
