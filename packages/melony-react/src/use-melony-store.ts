import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { MelonyEvent, generateId } from "@melony/core/browser";
import {
  TransportFn,
  createHttpTransport,
  ChatMessage,
  TransportRequest,
} from "@melony/client";

// ============================================================================
// Types
// ============================================================================

/**
 * Represents a conversation thread.
 * 
 * The `id` serves as both UI and backend identifier (unified ID system).
 * 
 * @example
 * ```ts
 * const thread: Thread = {
 *   id: 'abc123',
 *   title: 'Weather Query',
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 *   preview: 'What is the weather...'
 * };
 * ```
 */
export interface Thread {
  /** Unique identifier (used for both UI and backend) */
  id: string;
  /** Display title */
  title: string;
  /** When the thread was created */
  createdAt: Date;
  /** When the thread was last updated */
  updatedAt: Date;
  /** Optional preview text (usually first message snippet) */
  preview?: string;
}

/**
 * Thread with its associated messages and loading state.
 * This is the internal representation used by the store.
 */
export interface ThreadState {
  /** The thread metadata */
  thread: Thread;
  /** Messages in this thread */
  messages: ChatMessage[];
  /** Whether the thread is currently loading (sending/receiving) */
  isLoading: boolean;
}

/**
 * Internal state shape for the Melony store.
 */
export interface MelonyStoreState {
  /** Map of thread ID to thread state */
  threads: Map<string, ThreadState>;
  /** Currently active thread ID */
  activeThreadId: string | null;
  /** Last error that occurred */
  error: Error | null;
}

/**
 * Event types handled by the store.
 * 
 * Use `dispatchEvent()` from `useMelony()` to trigger these:
 * 
 * @example
 * ```ts
 * const { dispatchEvent } = useMelony();
 * 
 * // Create a new thread
 * dispatchEvent({ type: 'createThread' });
 * 
 * // Send a message
 * dispatchEvent({
 *   type: 'sendMessage',
 *   data: {
 *     role: 'user',
 *     content: [{ type: 'text', data: { content: 'Hello!' } }]
 *   }
 * });
 * ```
 */
export type MelonyStoreEventType =
  | "createThread"
  | "switchThread"
  | "deleteThread"
  | "updateThreadTitle"
  | "updateThreadPreview"
  | "sendMessage"
  | "clearThread";

/**
 * Options for configuring the useMelonyStore hook.
 * 
 * @example
 * ```tsx
 * <MelonyStoreProvider
 *   api="/api/chat"
 *   onLoadHistory={async (threadId) => {
 *     const res = await fetch(`/api/threads/${threadId}/messages`);
 *     return res.json();
 *   }}
 *   onThreadsChange={(threads) => {
 *     localStorage.setItem('threads', JSON.stringify(threads));
 *   }}
 * >
 *   <App />
 * </MelonyStoreProvider>
 * ```
 */
export interface UseMelonyStoreOptions {
  /** Custom transport function for API communication */
  transport?: TransportFn;
  /** API endpoint URL (creates HTTP transport automatically) */
  api?: string;
  /**
   * Callback to load message history when switching threads.
   * Called when switching to a thread that has no messages loaded.
   * Return messages to populate the thread, or empty array if no history.
   */
  onLoadHistory?: (threadId: string) => Promise<ChatMessage[]>;
  /**
   * Callback when threads change (for persistence).
   * Called whenever threads are created, updated, or deleted.
   */
  onThreadsChange?: (threads: Thread[]) => void;
}

/**
 * Return type for the useMelonyStore hook.
 */
export interface UseMelonyStoreReturn {
  // ---- State ----
  /** All threads, sorted by updatedAt (most recent first) */
  threads: Thread[];
  /** ID of the currently active thread */
  activeThreadId: string | null;
  /** The currently active thread (undefined if none) */
  activeThread: Thread | undefined;
  /** Messages in the active thread */
  messages: ChatMessage[];
  /** Whether the active thread is loading */
  isLoading: boolean;
  /** Last error that occurred */
  error: Error | null;

  // ---- Event Handler ----
  /** 
   * Unified event handler for all store actions.
   * Usually you'll use `dispatchEvent` from `useMelony()` instead.
   */
  handleEvent: (event: MelonyEvent) => void;

  // ---- Getters ----
  /** Get a thread by ID */
  getThread: (threadId: string) => Thread | undefined;
  /** Get messages for a specific thread */
  getThreadMessages: (threadId: string) => ChatMessage[];
  /** Get the full state for a thread */
  getThreadState: (threadId: string) => ThreadState | undefined;
}

// ============================================================================
// Message Merging Logic
// ============================================================================

/**
 * Merge an event into the messages array
 * Handles text streaming, grouping by runId, etc.
 */
function mergeMessageEvent(
  messages: ChatMessage[],
  event: MelonyEvent
): ChatMessage[] {
  // Handle approval-consumed event: mark the approval UI as consumed
  if (event.type === "approval-consumed" && event.data?.pendingActionId) {
    return messages.map((msg) => {
      if (msg.role !== "assistant" || !Array.isArray(msg.content)) return msg;

      const updatedContent = msg.content.map((e: MelonyEvent) => {
        if (
          e.type === "approval-required" &&
          e.data?.pendingActionId === event.data.pendingActionId
        ) {
          // Mark as consumed so UI can disable the form
          return { ...e, data: { ...e.data, consumed: true } };
        }
        return e;
      });

      return { ...msg, content: updatedContent };
    });
  }

  const lastMsg = messages[messages.length - 1];
  const isAssistant = lastMsg?.role === "assistant";
  const isSameGroup =
    isAssistant &&
    lastMsg.runId &&
    event.runId &&
    lastMsg.runId === event.runId;

  if (isSameGroup) {
    const currentContent = Array.isArray(lastMsg.content) ? lastMsg.content : [];

    // Handle text merging (streaming deltas)
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
            content: (lastEvent.data?.content || "") + (event.data?.content || ""),
            state: event.data?.state,
          },
        };
        const newContent = [...currentContent];
        newContent[lastTextEventIndex] = updatedLastEvent;
        return [...messages.slice(0, -1), { ...lastMsg, content: newContent }];
      }
    }

    // Add as new event in same message group
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

// ============================================================================
// Main Hook
// ============================================================================

/**
 * Unified state management hook for Melony chat applications.
 * 
 * Manages threads, messages, and communication with the backend.
 * All actions are event-based for consistency.
 * 
 * **Usually you should use `MelonyStoreProvider` + `useMelony()` instead of this hook directly.**
 * 
 * @example
 * ```tsx
 * // Direct usage (advanced)
 * const store = useMelonyStore({ api: '/api/chat' });
 * 
 * // Create a thread
 * store.handleEvent({ type: 'createThread' });
 * 
 * // Access state
 * console.log(store.threads, store.messages);
 * ```
 * 
 * @param options - Configuration options
 * @returns Store state and event handler
 */
export function useMelonyStore(
  options: UseMelonyStoreOptions = {}
): UseMelonyStoreReturn {
  const { transport: transportOption, api, onLoadHistory, onThreadsChange } = options;

  // Transport for API communication
  const transport = useMemo<TransportFn | null>(() => {
    if (transportOption) return transportOption;
    if (api) return createHttpTransport(api);
    return null;
  }, [transportOption, api]);

  // Unified state
  const [state, setState] = useState<MelonyStoreState>({
    threads: new Map(),
    activeThreadId: null,
    error: null,
  });

  // Ref for abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  // ============================================================================
  // Derived State
  // ============================================================================

  const threads = useMemo(() => {
    return Array.from(state.threads.values())
      .map((ts) => ts.thread)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [state.threads]);

  const activeThreadState = state.activeThreadId
    ? state.threads.get(state.activeThreadId)
    : undefined;

  const activeThread = activeThreadState?.thread;
  const messages = activeThreadState?.messages ?? [];
  const isLoading = activeThreadState?.isLoading ?? false;

  // Notify on threads change
  useEffect(() => {
    if (onThreadsChange) {
      onThreadsChange(threads);
    }
  }, [threads, onThreadsChange]);

  // ============================================================================
  // Getters
  // ============================================================================

  const getThread = useCallback(
    (threadId: string): Thread | undefined => {
      return state.threads.get(threadId)?.thread;
    },
    [state.threads]
  );

  const getThreadMessages = useCallback(
    (threadId: string): ChatMessage[] => {
      return state.threads.get(threadId)?.messages ?? [];
    },
    [state.threads]
  );

  const getThreadState = useCallback(
    (threadId: string): ThreadState | undefined => {
      return state.threads.get(threadId);
    },
    [state.threads]
  );

  // ============================================================================
  // Internal Actions
  // ============================================================================

  const createThread = useCallback(
    (data?: { initialMessage?: string; title?: string }): string => {
      const id = generateId();
      const title = data?.title || data?.initialMessage?.slice(0, 50).trim() || "New Chat";

      const newThread: Thread = {
        id,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        preview: data?.initialMessage?.slice(0, 100),
      };

      const newThreadState: ThreadState = {
        thread: newThread,
        messages: [],
        isLoading: false,
      };

      setState((prev) => {
        const newThreads = new Map(prev.threads);
        newThreads.set(id, newThreadState);
        return {
          ...prev,
          threads: newThreads,
          activeThreadId: id,
        };
      });

      return id;
    },
    []
  );

  const switchThread = useCallback(
    async (threadId: string) => {
      const threadState = state.threads.get(threadId);
      if (!threadState) return;

      setState((prev) => ({
        ...prev,
        activeThreadId: threadId,
      }));

      // Load history if callback provided and no messages yet
      if (onLoadHistory && threadState.messages.length === 0) {
        try {
          const history = await onLoadHistory(threadId);
          setState((prev) => {
            const ts = prev.threads.get(threadId);
            if (!ts) return prev;

            const newThreads = new Map(prev.threads);
            newThreads.set(threadId, {
              ...ts,
              messages: history,
            });
            return { ...prev, threads: newThreads };
          });
        } catch (err) {
          console.error("Failed to load thread history:", err);
        }
      }
    },
    [state.threads, onLoadHistory]
  );

  const deleteThread = useCallback((threadId: string) => {
    setState((prev) => {
      const newThreads = new Map(prev.threads);
      newThreads.delete(threadId);

      // If deleting active thread, switch to another
      let newActiveId = prev.activeThreadId;
      if (prev.activeThreadId === threadId) {
        const remaining = Array.from(newThreads.keys());
        newActiveId = remaining.length > 0 ? remaining[0] : null;
      }

      return {
        ...prev,
        threads: newThreads,
        activeThreadId: newActiveId,
      };
    });
  }, []);

  const updateThreadTitle = useCallback((threadId: string, title: string) => {
    setState((prev) => {
      const ts = prev.threads.get(threadId);
      if (!ts) return prev;

      const newThreads = new Map(prev.threads);
      newThreads.set(threadId, {
        ...ts,
        thread: { ...ts.thread, title, updatedAt: new Date() },
      });
      return { ...prev, threads: newThreads };
    });
  }, []);

  const updateThreadPreview = useCallback((threadId: string, preview: string) => {
    setState((prev) => {
      const ts = prev.threads.get(threadId);
      if (!ts) return prev;

      const newThreads = new Map(prev.threads);
      newThreads.set(threadId, {
        ...ts,
        thread: { ...ts.thread, preview, updatedAt: new Date() },
      });
      return { ...prev, threads: newThreads };
    });
  }, []);

  const clearThread = useCallback((threadId: string) => {
    setState((prev) => {
      const ts = prev.threads.get(threadId);
      if (!ts) return prev;

      const newThreads = new Map(prev.threads);
      newThreads.set(threadId, {
        ...ts,
        messages: [],
        isLoading: false,
      });
      return { ...prev, threads: newThreads };
    });
  }, []);

  const sendMessage = useCallback(
    async (data: {
      threadId?: string;
      role: "user" | "system";
      content: MelonyEvent[];
    }) => {
      if (!transport) {
        console.error("No transport configured for sendMessage");
        return;
      }

      let targetThreadId = data.threadId || state.activeThreadId;

      // Auto-create thread if none exists
      if (!targetThreadId) {
        const firstTextEvent = data.content.find((e) => e.type === "text");
        const initialMessage = firstTextEvent?.data?.content;
        targetThreadId = createThread({ initialMessage });
      }

      const threadState = state.threads.get(targetThreadId);
      if (!threadState && targetThreadId !== state.activeThreadId) {
        // Thread was just created, get it from state after creation
        // We need to wait for state update, so we'll proceed anyway
      }

      // Abort previous request if in progress
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Create the user/system message
      const newMessage: ChatMessage = {
        role: data.role,
        content: data.content,
      };

      // Optimistic update - add message and set loading
      setState((prev) => {
        const ts = prev.threads.get(targetThreadId!);
        if (!ts) return prev;

        const newThreads = new Map(prev.threads);
        newThreads.set(targetThreadId!, {
          ...ts,
          messages: [...ts.messages, newMessage],
          isLoading: true,
          thread: { ...ts.thread, updatedAt: new Date() },
        });
        return { ...prev, threads: newThreads, error: null };
      });

      try {
        const signal = abortControllerRef.current.signal;
        const transportRequest: TransportRequest = {
          message: newMessage,
          threadId: targetThreadId,
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
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim() === "") continue;

            if (line.startsWith("data: ")) {
              try {
                const event: MelonyEvent = JSON.parse(line.slice(6));

                // Update messages with event merging
                setState((prev) => {
                  const ts = prev.threads.get(targetThreadId!);
                  if (!ts) return prev;

                  const newThreads = new Map(prev.threads);
                  newThreads.set(targetThreadId!, {
                    ...ts,
                    messages: mergeMessageEvent(ts.messages, event),
                  });
                  return { ...prev, threads: newThreads };
                });
              } catch (e) {
                console.error("Failed to parse event:", e);
              }
            }
          }
        }

        // Set loading false when done
        setState((prev) => {
          const ts = prev.threads.get(targetThreadId!);
          if (!ts) return prev;

          const newThreads = new Map(prev.threads);
          newThreads.set(targetThreadId!, {
            ...ts,
            isLoading: false,
          });
          return { ...prev, threads: newThreads };
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setState((prev) => {
            const ts = prev.threads.get(targetThreadId!);
            if (!ts) return prev;

            const newThreads = new Map(prev.threads);
            newThreads.set(targetThreadId!, { ...ts, isLoading: false });
            return { ...prev, threads: newThreads };
          });
          return;
        }

        const error = err instanceof Error ? err : new Error(String(err));
        setState((prev) => {
          const ts = prev.threads.get(targetThreadId!);
          if (!ts) return prev;

          const newThreads = new Map(prev.threads);
          newThreads.set(targetThreadId!, { ...ts, isLoading: false });
          return { ...prev, threads: newThreads, error };
        });
      }
    },
    [transport, state.activeThreadId, state.threads, createThread]
  );

  // ============================================================================
  // Unified Event Handler
  // ============================================================================

  const handleEvent = useCallback(
    (event: MelonyEvent) => {
      switch (event.type) {
        case "createThread":
          createThread(event.data);
          break;

        case "switchThread":
          if (event.data?.threadId) {
            switchThread(event.data.threadId);
          }
          break;

        case "deleteThread":
          if (event.data?.threadId) {
            deleteThread(event.data.threadId);
          }
          break;

        case "updateThreadTitle":
          if (event.data?.threadId && event.data?.title) {
            updateThreadTitle(event.data.threadId, event.data.title);
          }
          break;

        case "updateThreadPreview":
          if (event.data?.threadId && event.data?.preview) {
            updateThreadPreview(event.data.threadId, event.data.preview);
          }
          break;

        case "sendMessage":
          if (event.data) {
            sendMessage({
              threadId: event.data.threadId,
              role: event.data.role || "user",
              content: event.data.content || [],
            });
          }
          break;

        case "clearThread":
          if (event.data?.threadId) {
            clearThread(event.data.threadId);
          } else if (state.activeThreadId) {
            clearThread(state.activeThreadId);
          }
          break;

        default:
          // Unknown event type - could log or pass through
          break;
      }
    },
    [
      createThread,
      switchThread,
      deleteThread,
      updateThreadTitle,
      updateThreadPreview,
      sendMessage,
      clearThread,
      state.activeThreadId,
    ]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    threads,
    activeThreadId: state.activeThreadId,
    activeThread,
    messages,
    isLoading,
    error: state.error,

    // Event handler
    handleEvent,

    // Getters
    getThread,
    getThreadMessages,
    getThreadState,
  };
}

