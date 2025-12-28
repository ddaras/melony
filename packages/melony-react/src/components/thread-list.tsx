import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconPlus,
  IconMessage,
  IconTrash,
  IconLoader2,
} from "@tabler/icons-react";
import { useThreads } from "@/hooks/use-threads";

export interface ThreadListProps {
  className?: string;
  emptyState?: React.ReactNode;
  onThreadSelect?: (threadId: string) => void;
}

export const ThreadList: React.FC<ThreadListProps> = ({
  className,
  emptyState,
  onThreadSelect,
}) => {
  const {
    threads,
    activeThreadId,
    selectThread,
    createThread,
    deleteThread,
    isLoading,
  } = useThreads();

  const handleThreadClick = (threadId: string) => {
    if (threadId !== activeThreadId) {
      selectThread(threadId);
    }
    onThreadSelect?.(threadId);
  };

  const handleDelete = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    try {
      await deleteThread(threadId);
    } catch (error) {
      console.error("Failed to delete thread:", error);
    }
  };

  const handleNewThread = async () => {
    try {
      await createThread();
    } catch (error) {
      console.error("Failed to create thread:", error);
    }
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString();
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewThread}
          className="w-full justify-start"
        >
          <IconPlus className="mr-2 size-4" />
          New Thread
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && threads.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : threads.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {emptyState || (
              <div className="space-y-2">
                <IconMessage className="size-8 mx-auto opacity-50" />
                <p className="text-sm">No threads yet</p>
                <Button variant="ghost" size="sm" onClick={handleNewThread}>
                  Start a conversation
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {threads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => handleThreadClick(thread.id)}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-pointer transition-colors",
                    isActive ? "bg-muted" : "hover:bg-muted"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("text-sm font-medium truncate")}>
                        {thread.title || `Thread ${thread.id.slice(0, 8)}`}
                      </p>
                      {thread.updatedAt && (
                        <span className={cn("text-xs shrink-0")}>
                          {formatDate(thread.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => handleDelete(e, thread.id)}
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
                      isActive && "hover:bg-primary-foreground/20"
                    )}
                  >
                    <IconTrash className="size-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
