import * as React from "react";
import { useThreads } from "@/hooks/use-threads";
import { Dropdown } from "./elements/Dropdown";
import { Box, Float, List, ListItem } from "./elements";
import { UIColor, UISpacing, UIRadius } from "../ui-contract";

export interface ThreadListProps {
  padding?: UISpacing;
  gap?: UISpacing;
  background?: UIColor;
  radius?: UIRadius;
}

export const ThreadList: React.FC<ThreadListProps> = ({
  padding,
  background,
  gap,
  radius = "md",
}) => {
  const { threads, activeThreadId } = useThreads();

  const sortedThreads = React.useMemo(() => {
    return [...threads].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [threads]);

  return (
    <List padding={padding} gap={gap} flex="1" overflow="auto">
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
            background={isActive ? "primary" : "transparent"}
          >
            <Box group width="full">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium truncate">
                  {thread.title || `Thread ${thread.id.slice(0, 8)}`}
                </p>
              </div>

              <Float position="right-center" showOnHover>
                <Dropdown
                  items={[
                    {
                      label: "Delete",
                      icon: "trash",
                      onClickAction: {
                        type: "delete-thread",
                        data: {
                          threadId: thread.id,
                        },
                      },
                    },
                  ]}
                />
              </Float>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};
