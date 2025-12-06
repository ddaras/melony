import { useState, useEffect, useCallback } from "react";
import { generateId } from "@melony/core";

export interface Thread {
  id: string;
  title: string; // Auto-generated from first message or user-provided
  threadId: string; // The actual thread/conversation ID used for backend
  createdAt: Date;
  updatedAt: Date;
  preview?: string; // First message preview
}

export interface UseMelonyThreadsOptions {
  storageKey?: string; // For localStorage persistence, e.g., "melony-threads"
  onThreadChange?: (threadId: string) => void;
  initialThreadId?: string; // Initial active thread ID
}

export interface UseMelonyThreadsReturn {
  threads: Thread[];
  activeThreadId: string | null;
  createThread: () => string; // Returns new thread ID
  switchThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  updateThreadTitle: (threadId: string, title: string) => void;
  updateThreadPreview: (threadId: string, preview: string) => void;
  getThread: (threadId: string) => Thread | undefined;
  getActiveThread: () => Thread | undefined;
}

const DEFAULT_STORAGE_KEY = "melony-threads";

/**
 * Hook for managing multiple chat threads
 * Handles thread creation, switching, deletion, and persistence
 */
export function useMelonyThreads(
  options: UseMelonyThreadsOptions = {}
): UseMelonyThreadsReturn {
  const {
    storageKey = DEFAULT_STORAGE_KEY,
    onThreadChange,
    initialThreadId,
  } = options;

  // Load threads from localStorage on mount
  const loadThreads = useCallback((): Thread[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((thread: any) => ({
          ...thread,
          createdAt: new Date(thread.createdAt),
          updatedAt: new Date(thread.updatedAt),
        }));
      }
    } catch (error) {
      console.error("Failed to load threads from localStorage:", error);
    }
    return [];
  }, [storageKey]);

  // Save threads to localStorage
  const saveThreads = useCallback(
    (threads: Thread[]) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(threads));
      } catch (error) {
        console.error("Failed to save threads to localStorage:", error);
      }
    },
    [storageKey]
  );

  // Always start with empty array to ensure server/client match
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    initialThreadId || null
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Load threads only on client after hydration
  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true);
    
    // Load threads from localStorage
    const loadedThreads = loadThreads();
    setThreads(loadedThreads);

    // Set active thread if provided or use first thread
    if (initialThreadId) {
      setActiveThreadId(initialThreadId);
    } else if (loadedThreads.length > 0) {
      // If no initial thread ID and we have threads, use the most recently updated one
      const sorted = [...loadedThreads].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );
      setActiveThreadId(sorted[0].id);
      if (onThreadChange) {
        onThreadChange(sorted[0].threadId);
      }
    }
  }, []); // Only run on mount

  // Save threads whenever they change (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveThreads(threads);
    }
  }, [threads, isHydrated]); // Removed saveThreads from deps - it's stable

  const createThread = useCallback((): string => {
    const newThreadId = generateId();
    const newThread: Thread = {
      id: generateId(), // Internal ID for UI
      title: "New Chat",
      threadId: newThreadId, // Backend thread ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    
    if (onThreadChange) {
      onThreadChange(newThread.threadId);
    }

    return newThread.id;
  }, [onThreadChange]);

  const switchThread = useCallback(
    (threadId: string) => {
      const thread = threads.find((t) => t.id === threadId);
      if (thread) {
        setActiveThreadId(threadId);
        if (onThreadChange) {
          onThreadChange(thread.threadId);
        }
      }
    },
    [threads, onThreadChange]
  );

  const deleteThread = useCallback(
    (threadId: string) => {
      setThreads((prev) => {
        const filtered = prev.filter((t) => t.id !== threadId);
        
        // If we deleted the active thread, switch to another one or create new
        if (activeThreadId === threadId) {
          if (filtered.length > 0) {
            const sorted = [...filtered].sort(
              (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
            );
            setActiveThreadId(sorted[0].id);
            if (onThreadChange) {
              onThreadChange(sorted[0].threadId);
            }
          } else {
            setActiveThreadId(null);
          }
        }
        
        return filtered;
      });
    },
    [activeThreadId, onThreadChange]
  );

  const updateThreadTitle = useCallback(
    (threadId: string, title: string) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? { ...t, title, updatedAt: new Date() }
            : t
        )
      );
    },
    []
  );

  const updateThreadPreview = useCallback(
    (threadId: string, preview: string) => {
      setThreads((prev) =>
        prev.map((t) => {
          // Only update if preview actually changed to prevent infinite loops
          if (t.id === threadId && t.preview !== preview) {
            return { ...t, preview, updatedAt: new Date() };
          }
          return t;
        })
      );
    },
    []
  );

  const getThread = useCallback(
    (threadId: string): Thread | undefined => {
      return threads.find((t) => t.id === threadId);
    },
    [threads]
  );

  const getActiveThread = useCallback((): Thread | undefined => {
    if (!activeThreadId) return undefined;
    return threads.find((t) => t.id === activeThreadId);
  }, [threads, activeThreadId]);

  return {
    threads,
    activeThreadId,
    createThread,
    switchThread,
    deleteThread,
    updateThreadTitle,
    updateThreadPreview,
    getThread,
    getActiveThread,
  };
}

