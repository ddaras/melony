import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { Event } from "melony";
import { generateId } from "melony/client";
import { ThreadData, ThreadService } from "@/types";

export interface ThreadContextValue {
  threads: ThreadData[];
  activeThreadId: string | null;
  isLoading: boolean;
  error: Error | null;
  selectThread: (threadId: string) => void;
  createThread: () => Promise<string>;
  deleteThread: (threadId: string) => Promise<void>;
  refreshThreads: () => Promise<void>;
  threadEvents: Event[];
  isLoadingEvents: boolean;
}

export const ThreadContext = createContext<ThreadContextValue | undefined>(
  undefined
);

export interface ThreadProviderProps {
  children: ReactNode;
  service: ThreadService;
  initialThreadId?: string;
}

export const ThreadProvider: React.FC<ThreadProviderProps> = ({
  children,
  service,
  initialThreadId: providedInitialThreadId,
}) => {
  const defaultInitialThreadId = useMemo(() => generateId(), []);
  const initialThreadId = providedInitialThreadId || defaultInitialThreadId;

  const [threads, setThreads] = useState<ThreadData[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    initialThreadId
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [threadEvents, setThreadEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const fetchThreads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const processedThreads = await service.getThreads();
      setThreads(processedThreads);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch threads");
      setError(error);
      console.error("Failed to fetch threads:", error);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const selectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
  }, []);

  const createThread = useCallback(async (): Promise<string> => {
    const newId = service.createThread
      ? await service.createThread()
      : generateId();
    const newThread: ThreadData = {
      id: newId,
      updatedAt: new Date(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newId);
    return newId;
  }, [service]);

  const deleteThread = useCallback(
    async (threadId: string) => {
      try {
        await service.deleteThread(threadId);

        setThreads((prev) => {
          const remainingThreads = prev.filter((t) => t.id !== threadId);
          setActiveThreadId((current) => {
            if (current === threadId) {
              return remainingThreads.length > 0
                ? remainingThreads[0].id
                : null;
            }
            return current;
          });
          return remainingThreads;
        });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to delete thread");
        setError(error);
        throw error;
      }
    },
    [service]
  );

  const refreshThreads = useCallback(async () => {
    await fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    if (!activeThreadId) {
      setThreadEvents([]);
      setIsLoadingEvents(false);
      return;
    }

    let cancelled = false;
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const events = await service.getEvents(activeThreadId);
        if (!cancelled) {
          setThreadEvents(events);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch events:", err);
          setThreadEvents([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingEvents(false);
        }
      }
    };

    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, [activeThreadId, service]);

  const value = useMemo(
    () => ({
      threads,
      activeThreadId,
      isLoading,
      error,
      selectThread,
      createThread,
      deleteThread,
      refreshThreads,
      threadEvents,
      isLoadingEvents,
    }),
    [
      threads,
      activeThreadId,
      isLoading,
      error,
      selectThread,
      createThread,
      deleteThread,
      refreshThreads,
      threadEvents,
      isLoadingEvents,
    ]
  );

  return (
    <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
  );
};
