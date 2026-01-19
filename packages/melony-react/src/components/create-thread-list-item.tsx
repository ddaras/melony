import * as React from "react";
import { IconPlus } from "@tabler/icons-react";
import { useThreads } from "@/hooks/use-threads";
import { cn } from "@/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { ListItem } from "./elements";
import { UIColor, UIRadius, UISpacing } from "melony";

export interface CreateThreadListItemProps {
  padding?: UISpacing;
  background?: UIColor;
  radius?: UIRadius;
}

export const CreateThreadListItem: React.FC<CreateThreadListItemProps> = ({
  padding = "sm",
  background,
  radius = "md",
}) => {
  const { createThread } = useThreads();
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreateThread = async () => {
    if (isCreating) return; // Prevent multiple simultaneous creations
    try {
      setIsCreating(true);
      const threadId = await createThread();
    } catch (error) {
      console.error("Failed to create thread:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Hotkey to create new thread: Press 'N' to create
  // Scopes ensure it doesn't trigger when typing in inputs/textareas
  useHotkeys(
    "n",
    (e: KeyboardEvent) => {
      e.preventDefault();
      handleCreateThread();
    },
    {
      enableOnFormTags: false, // Don't trigger when typing in form inputs
      enableOnContentEditable: false, // Don't trigger in contenteditable elements
    },
  );

  return (
    <ListItem
      onClickAction={{
        type: "client:navigate",
        data: {
          url: "?",
        },
      }}
      padding={padding}
      background={background}
      radius={radius}
    >
      <IconPlus className="size-4" />
      New chat
    </ListItem>
  );
};
