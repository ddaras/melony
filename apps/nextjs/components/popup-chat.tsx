import { useState } from "react";
import {
  IconArrowLeft,
  IconHistory,
  IconMessage,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { Thread } from "./thread";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { StarterPrompt, ComposerOptionGroup } from "@/types";
import { useThreads } from "@/hooks/use-threads";
import { ChatHeader, ChatHeaderProps } from "./chat-header";
import { ThreadList } from "./thread-list";

export interface PopupChatProps {
  title?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  options?: ComposerOptionGroup[];
  defaultOpen?: boolean;
  /**
   * Props for customizing the header. Note: leftContent and rightContent in headerProps
   * will be merged with the default popup header actions (back, history, new chat, close).
   */
  headerProps?: Omit<ChatHeaderProps, "title" | "leftContent" | "rightContent">;
  /**
   * IDs of options to be selected by default
   */
  defaultSelectedIds?: string[];
}

export function PopupChat({
  title = "Chat",
  placeholder = "Message the AI",
  starterPrompts,
  options,
  defaultOpen = false,
  headerProps,
  defaultSelectedIds,
}: PopupChatProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [view, setView] = useState<"chat" | "history">("chat");
  const { createThread } = useThreads();

  const handleNewChat = async () => {
    try {
      await createThread();
      setView("chat");
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {isOpen && (
        <Card className="py-0 w-[440px] h-[640px] gap-0 flex flex-col overflow-hidden border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
          <ChatHeader
            title={view === "history" ? "History" : title}
            leftContent={
              view === "history" ? (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setView("chat")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <IconArrowLeft className="size-4" />
                </Button>
              ) : undefined
            }
            rightContent={
              <>
                {view === "chat" && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setView("history")}
                    className="text-muted-foreground hover:text-foreground"
                    title="History"
                  >
                    <IconHistory className="size-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleNewChat}
                  className="text-muted-foreground hover:text-foreground"
                  title="New Chat"
                >
                  <IconPlus className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <IconX className="size-4" />
                </Button>
              </>
            }
            {...headerProps}
          />
          <div className="flex-1 overflow-hidden">
            {view === "chat" ? (
              <Thread
                placeholder={placeholder}
                starterPrompts={starterPrompts}
                options={options}
                defaultSelectedIds={defaultSelectedIds}
              />
            ) : (
              <ThreadList
                padding="md"
                gap="md"
                background="muted"
                radius="md"
              />
            )}
          </div>
        </Card>
      )}

      <Button
        size="icon-lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95",
          isOpen
            ? "bg-muted text-muted-foreground hover:bg-muted/80"
            : "bg-primary text-primary-foreground",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <IconX className="size-6" />
        ) : (
          <IconMessage className="size-6" />
        )}
      </Button>
    </div>
  );
}
