import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ThreadList } from "./thread-list";
import { IconHistory } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";

export interface ThreadPopoverProps {
  className?: string;
  buttonClassName?: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  buttonSize?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
  emptyState?: React.ReactNode;
  onThreadSelect?: (threadId: string) => void;
}

export const ThreadPopover: React.FC<ThreadPopoverProps> = ({
  className,
  buttonClassName,
  buttonVariant = "ghost",
  buttonSize = "sm",
  emptyState,
  onThreadSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Hotkey to toggle popover: Press 'H' to open/close
  // Scopes ensure it doesn't trigger when typing in inputs/textareas
  useHotkeys(
    "h",
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    },
    {
      enableOnFormTags: false, // Don't trigger when typing in form inputs
      enableOnContentEditable: false, // Don't trigger in contenteditable elements
    }
  );

  const handleThreadSelect = (threadId: string) => {
    setIsOpen(false);
    onThreadSelect?.(threadId);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={cn(buttonClassName)}
        >
          <IconHistory className="mr-2 size-4" />
          History
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-80 p-0", className)}
        side="bottom"
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col h-[400px]">
          <ThreadList
            emptyState={emptyState}
            onThreadSelect={handleThreadSelect}
            className="h-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
