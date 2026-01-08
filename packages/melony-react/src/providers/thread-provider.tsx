import React, {
  createContext,
  useCallback,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Event } from "melony";
import { ThreadData, ThreadService } from "@/types";
import { useQueryState, parseAsString } from "nuqs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MelonyContext } from "./melony-provider";

export interface ThreadContextValue {
  threads: ThreadData[];
  activeThreadId: string | null;
  isLoading: boolean;
  error: Error | null;
  selectThread: (threadId: string) => void;
  createThread: () => Promise<string | null>;
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
  const queryClient = useQueryClient();
  const melonyContext = useContext(MelonyContext);

  const [activeThreadId, setActiveThreadId] = useQueryState(
    "threadId",
    parseAsString
  );

  const prevActiveThreadIdRef = useRef<string | null>(activeThreadId);

  useEffect(() => {
    prevActiveThreadIdRef.current = activeThreadId;
  }, [activeThreadId]);

  useEffect(() => {
    if (!activeThreadId && providedInitialThreadId) {
      setActiveThreadId(providedInitialThreadId);
    }
  }, [activeThreadId, providedInitialThreadId, setActiveThreadId]);

  // Fetch all threads
  const {
    data: threads = [],
    isLoading,
    isFetched: isFetchedThreads,
    error: threadsError,
    refetch: refreshThreads,
  } = useQuery({
    queryKey: ["threads"],
    queryFn: () => service.getThreads(),
    staleTime: prevActiveThreadIdRef.current === null && activeThreadId !== null ? Infinity : 0,
  });

  const isNewThread = useMemo(() => {
    if (!activeThreadId || !isFetchedThreads) return false;
    return !threads.some((t) => t.id === activeThreadId);
  }, [activeThreadId, threads, isFetchedThreads]);

  // Fetch events for active thread
  const { data: threadEvents = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ["threads", activeThreadId, "events"],
    queryFn: () => service.getEvents(activeThreadId!),
    enabled: !!activeThreadId,
    initialData: isNewThread ? melonyContext?.events : undefined,
    staleTime: isNewThread ? Infinity : 0,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return null;
    },
    onSuccess: async () => {
      await setActiveThreadId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (threadId: string) => service.deleteThread(threadId),
    onSuccess: async (_, threadId) => {
      await queryClient.invalidateQueries({ queryKey: ["threads"] });
      if (activeThreadId === threadId) {
        const remainingThreads = threads.filter((t) => t.id !== threadId);
        const nextId =
          remainingThreads.length > 0 ? remainingThreads[0].id : null;
        await setActiveThreadId(nextId);
      }
    },
  });

  const selectThread = useCallback(
    (threadId: string) => {
      setActiveThreadId(threadId);
    },
    [setActiveThreadId]
  );

  const createThread = useCallback(async () => {
    return createMutation.mutateAsync();
  }, [createMutation]);

  const deleteThread = useCallback(
    async (threadId: string) => {
      return deleteMutation.mutateAsync(threadId);
    },
    [deleteMutation]
  );

  const value = useMemo(
    () => ({
      threads,
      activeThreadId,
      isLoading,
      error: (threadsError as Error) || null,
      selectThread,
      createThread,
      deleteThread,
      refreshThreads: async () => {
        await refreshThreads();
      },
      threadEvents,
      isLoadingEvents,
    }),
    [
      threads,
      activeThreadId,
      isLoading,
      threadsError,
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
