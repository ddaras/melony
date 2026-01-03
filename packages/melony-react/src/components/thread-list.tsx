import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconMessage, IconTrash, IconLoader2, IconPlus, IconDotsVertical } from "@tabler/icons-react";
import { useThreads } from "@/hooks/use-threads";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const sortedThreads = React.useMemo(() => {
    return [...threads].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [threads]);

  const handleThreadClick = (threadId: string) => {
    if (threadId !== activeThreadId) {
      selectThread(threadId);
    }
    onThreadSelect?.(threadId);
  };

  const handleDelete = async (threadId: string) => {
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

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-9 px-3 border-dashed hover:border-solid transition-all"
          onClick={handleNewThread}
        >
          <IconPlus className="size-4" />
          <span className="text-sm font-medium">New chat</span>
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
            {sortedThreads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => handleThreadClick(thread.id)}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-pointer transition-colors",
                    isActive ? "bg-muted text-foreground" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {thread.title || `Thread ${thread.id.slice(0, 8)}`}
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={(props) => (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            {...props}
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onClick?.(e);
                            }}
                          >
                            <IconDotsVertical className="size-3.5" />
                          </Button>
                        )}
                      />
                      <DropdownMenuContent align="start" className="w-32">
                        <DropdownMenuItem 
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(thread.id);
                          }}
                        >
                          <IconTrash className="size-4 mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
