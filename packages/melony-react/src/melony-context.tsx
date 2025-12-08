import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { MelonyTheme, ThemeProvider } from "./theme";
import { MelonyEvent } from "@melony/core";
import { TransportFn } from "@melony/client";
import {
  useMelonyStore,
  Thread,
  ThreadState,
  UseMelonyStoreOptions,
} from "./use-melony-store";
import { ChatMessage } from "@melony/client";

type EventHandler = (evt: MelonyEvent) => void;

interface MelonyContextType {
  dispatchEvent: (evt: MelonyEvent) => void;
  addEventHandler: (listener: EventHandler) => () => void;

  // Store state - available when using MelonyStoreProvider
  threads: Thread[];
  activeThreadId: string | null;
  activeThread: Thread | undefined;
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;

  // Getters
  getThread: (threadId: string) => Thread | undefined;
  getThreadMessages: (threadId: string) => ChatMessage[];
  getThreadState: (threadId: string) => ThreadState | undefined;
}

export const MelonyContext = createContext<MelonyContextType | null>(null);

// ============================================================================
// Base Provider (without store, for custom implementations)
// ============================================================================

export interface MelonyProviderProps {
  children: React.ReactNode;
  theme?: Partial<MelonyTheme>;
  onEvent?: (event: MelonyEvent) => void;
}

/**
 * Basic MelonyProvider - provides event dispatch and theme.
 * Use this if you want to manage state yourself.
 * For full thread/chat management, use MelonyStoreProvider.
 */
export function MelonyProvider({
  children,
  theme,
  onEvent,
}: MelonyProviderProps) {
  const listenersRef = useRef<Set<EventHandler>>(new Set());

  const dispatchEvent = useCallback(
    (evt: MelonyEvent) => {
      // Call the onEvent prop if provided
      if (onEvent) {
        onEvent(evt);
      } else {
        console.log("Event:", evt);
      }

      // Notify all registered listeners
      listenersRef.current.forEach((listener) => {
        listener(evt);
      });
    },
    [onEvent]
  );

  const addEventHandler = useCallback((listener: EventHandler) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  // Empty store state for basic provider
  const emptyGetThread = useCallback(() => undefined, []);
  const emptyGetMessages = useCallback(() => [], []);
  const emptyGetState = useCallback(() => undefined, []);

  const contextValue = useMemo(
    () => ({
      dispatchEvent,
      addEventHandler,
      // Empty store state
      threads: [],
      activeThreadId: null,
      activeThread: undefined,
      messages: [],
      isLoading: false,
      error: null,
      getThread: emptyGetThread,
      getThreadMessages: emptyGetMessages,
      getThreadState: emptyGetState,
    }),
    [dispatchEvent, addEventHandler, emptyGetThread, emptyGetMessages, emptyGetState]
  );

  return (
    <MelonyContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MelonyContext.Provider>
  );
}

// ============================================================================
// Store Provider (with built-in thread/chat management)
// ============================================================================

export interface MelonyStoreProviderProps {
  children: React.ReactNode;
  theme?: Partial<MelonyTheme>;
  /**
   * API endpoint for chat
   */
  api?: string;
  /**
   * Custom transport function
   */
  transport?: TransportFn;
  /**
   * Callback to load message history when switching threads
   */
  onLoadHistory?: (threadId: string) => Promise<ChatMessage[]>;
  /**
   * Callback when threads change (for persistence)
   */
  onThreadsChange?: (threads: Thread[]) => void;
  /**
   * Additional event handler for custom events
   */
  onEvent?: (event: MelonyEvent) => void;
}

/**
 * MelonyStoreProvider - provides full thread/chat management with event-based API.
 * 
 * Events handled:
 * - createThread: Create a new thread
 * - switchThread: Switch to a thread { threadId }
 * - deleteThread: Delete a thread { threadId }
 * - updateThreadTitle: Update thread title { threadId, title }
 * - updateThreadPreview: Update thread preview { threadId, preview }
 * - sendMessage: Send a message { role, content, threadId? }
 * - clearThread: Clear thread messages { threadId? }
 * 
 * Any other events are passed to onEvent callback.
 */
export function MelonyStoreProvider({
  children,
  theme,
  api,
  transport,
  onLoadHistory,
  onThreadsChange,
  onEvent,
}: MelonyStoreProviderProps) {
  const listenersRef = useRef<Set<EventHandler>>(new Set());

  // Use the unified store
  const store = useMelonyStore({
    api,
    transport,
    onLoadHistory,
    onThreadsChange,
  });

  const dispatchEvent = useCallback(
    (evt: MelonyEvent) => {
      // Known store events - handle via store
      const storeEvents = [
        "createThread",
        "switchThread",
        "deleteThread",
        "updateThreadTitle",
        "updateThreadPreview",
        "sendMessage",
        "clearThread",
      ];

      if (storeEvents.includes(evt.type)) {
        store.handleEvent(evt);
      }

      // Also call custom onEvent for any event
      if (onEvent) {
        onEvent(evt);
      }

      // Notify all registered listeners
      listenersRef.current.forEach((listener) => {
        listener(evt);
      });
    },
    [store, onEvent]
  );

  const addEventHandler = useCallback((listener: EventHandler) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      dispatchEvent,
      addEventHandler,
      // Store state
      threads: store.threads,
      activeThreadId: store.activeThreadId,
      activeThread: store.activeThread,
      messages: store.messages,
      isLoading: store.isLoading,
      error: store.error,
      getThread: store.getThread,
      getThreadMessages: store.getThreadMessages,
      getThreadState: store.getThreadState,
    }),
    [
      dispatchEvent,
      addEventHandler,
      store.threads,
      store.activeThreadId,
      store.activeThread,
      store.messages,
      store.isLoading,
      store.error,
      store.getThread,
      store.getThreadMessages,
      store.getThreadState,
    ]
  );

  return (
    <MelonyContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MelonyContext.Provider>
  );
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Access Melony context for dispatching events and accessing store state
 */
export function useMelony() {
  const context = useContext(MelonyContext);
  if (!context) {
    throw new Error("useMelony must be used within MelonyProvider or MelonyStoreProvider");
  }
  return {
    dispatchEvent: context.dispatchEvent,
    // Store state
    threads: context.threads,
    activeThreadId: context.activeThreadId,
    activeThread: context.activeThread,
    messages: context.messages,
    isLoading: context.isLoading,
    error: context.error,
    // Getters
    getThread: context.getThread,
    getThreadMessages: context.getThreadMessages,
    getThreadState: context.getThreadState,
  };
}

/**
 * Hook to listen to dispatched events
 * @param callback - Function to call when an event is dispatched
 * @param deps - Optional dependency array for the callback
 */
export function useDispatchedEvent(
  callback: (evt: MelonyEvent) => void,
  deps?: React.DependencyList
) {
  const context = useContext(MelonyContext);
  const callbackRef = React.useRef(callback);

  // Keep callback ref up to date
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!context) {
      console.warn("useDispatchedEvent must be used within MelonyProvider");
      return;
    }

    // Create a stable listener that always calls the latest callback
    const listener = (evt: MelonyEvent) => {
      callbackRef.current(evt);
    };

    // Subscribe to events
    const unsubscribe = context.addEventHandler(listener);

    // Cleanup on unmount or deps change
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, ...(deps || [])]);
}
