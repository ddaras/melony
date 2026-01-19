import * as React from "react";
import { IconTrash } from "@tabler/icons-react";
import { useThreads } from "@/hooks/use-threads";
import { Dropdown } from "./elements/Dropdown";
import { List, ListItem } from "./elements";
import { UIColor, UISpacing, UIRadius } from "melony";

export interface ThreadListProps {
  padding?: UISpacing;
  gap?: UISpacing;
  background?: UIColor;
  radius?: UIRadius;
}

export const ThreadList: React.FC<ThreadListProps> = ({ padding, background, gap, radius = "md" }) => {
  const { threads, activeThreadId, deleteThread } = useThreads();

  const sortedThreads = React.useMemo(() => {
    return [...threads].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [threads]);

  const handleDelete = async (threadId: string) => {
    try {
      await deleteThread(threadId);
    } catch (error) {
      console.error("Failed to delete thread:", error);
    }
  };

  return (
    <List padding={padding} gap={gap} flex="1" overflow="scroll">
      {sortedThreads.map((thread) => {
        const isActive = thread.id === activeThreadId;
        return (
          <ListItem
            key={thread.id}
            onClickAction={{
              type: "client:navigate",
              data: {
                url: `?threadId=${thread.id}`,
              },
            }}
            background={background}
            radius={radius}
            padding={padding}
            gap={gap}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {thread.title || `Thread ${thread.id.slice(0, 8)}`}
              </p>
            </div>

            <div className="shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Dropdown
                items={[
                  {
                    label: "Delete",
                    icon: <IconTrash className="size-4" />,
                    onClick: () => handleDelete(thread.id),
                  },
                ]}
              />
            </div>
          </ListItem>
        );
      })}
    </List>
  );
};
